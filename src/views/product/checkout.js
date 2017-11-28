import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UserStore} from '~/stores/user';
import {Router} from 'aurelia-router';
import {constants} from '~/services/constants';
import {UploadService} from '~/services/upload';
import {PriceService} from '~/services/price';
import {ErrorReporting} from '~/services/error-reporting';
import animateScrollTo from 'animated-scroll-to';

@inject(Router, Api, UserStore, UploadService, ErrorReporting, PriceService)
export class CheckoutVM {
  error = {};
  tempUser = {};

  constructor(router, api, userStore, upload, errorReporting, priceService) {
    this.router = router;
    this.api = api;
    this.userStore = userStore;
    this.upload = upload;
    this.constants = constants;
    this.priceService = priceService;
    this.errorReporting = errorReporting;

    this.state = {
      addcard: false,
      error: {}
    };
  }

  activate(params) {
    // if the
    // try creating an order first
    // then try getting paid for the order

    this.api.fetch('countries')
      .then(countries => this.countries = countries.results)
      .catch(err => errorReporting.report(new Error(err.message)));

    this.getProduct(Number(params.product_id), params);
  }

  getBufferDays(countryId) {
    const bufferMap = {
      1: 3, // korea
      2: 4,  // japan
      4: 4
    };
    return bufferMap[countryId];
  }

  getProduct(id, selections) {
    this.api
      .fetch(`products/${id}`, {include: ['source']})
      .then(product => {
        this.product = product;
        const currentDay = new Date();
        if (this.userStore.user && this.userStore.user.address && !this.userStore.user.address.country){
          this.userStore.user.address.country = 'Singapore';
        }
        const deliveryDate = new Date(currentDay.setDate(currentDay.getDate() + (product.delivery_time || 10) + this.getBufferDays(product.source_id)));
        this.request = {
          product_id: product.id,
          source_id: product.source_id,
          shop_id: product.shop_id,
          base_price: product.price,
          cost: product.cost,
          tiers: product.source.tiers,
          local_delivery_fee: product.local_delivery_fee,
          delta: product.price_override,
          discount: product.discount,
          ems_fee: product.source.ems_fee,
          weight: product.weight,
          preorder: (product.preorder ? true : false),
          postage: product.courier || constants.defaultCourier,
          destination_id: this.userStore.user && this.userStore.user.country_id || constants.defaultDestination,
          collection_method: 'courier',
          count: 1,
          shipping_address: (this.userStore.user && this.userStore.user.address) || {line_1: '', line_2: '', zip: '', city: ''},
          delivery_date: deliveryDate.toISOString()
        };
        this.selectOptions(selections);
        this.request.total_price = this.priceService.getPrice(this.request, this.product);
      })
      .catch(err => this.errorReporting.report(new Error(err.message)));
  }

  getPrice() {
    const country = this.countries.find((country) => country.name === this.request.shipping_address.country);
    const ship = country ? country.shipping_fee : 0;
    this.request.total_price = ship + this.priceService.getPrice(this.request, this.product);
  }

  confirmPurchase() {
    this.router.navigateToRoute('acknowledge');
  }

  validate() {
    if (this.request.collection_method === 'courier') {
      if (!this.request.shipping_address.line_1) {
        this.state.error.addressRequired = true;
        throw new Error('Address required');
      }
      if (!this.request.shipping_address.zip) {
        this.state.error.zipRequired = true;
        throw new Error('Zip required');
      }
    }

    if (!this.userStore.user.email && !this.tempUser.email) {
      this.state.error.emailRequired = true;
      throw new Error('Email required');
    }
    if (!this.userStore.user.phone && !this.tempUser.phone) {
      this.state.error.phoneRequired = true;
      throw new Error('Phone required');
    }

    if (this.currentPaymentMethod === 'bankpayment') {
      if (!this.proof) {
        this.state.error.proofRequired = true;
        throw new Error('Proof required');
      }
    }

    return true;
  }

  saveAddress(address) {
    if (address.line_1 === constants.defaultShippingAddress.line_1) {
      return;
    }

    this.api.edit('me', { address: address })
      .then(success => this.userStore.user.address = address);
  }

  saveContact(tempUser) {
    if (tempUser.phone || tempUser.email) {
      this.api.edit('me', tempUser)
        .then(success => Object.assign(this.userStore.user, tempUser));
    }
  }

  toggleAddress() {
    if (this.request.collection_method === 'pickup') {
      this.request.shipping_address = this.constants.defaultShippingAddress;
    } else if (this.request.collection_method === 'courier') {
      this.request.shipping_address = this.userStore.user && this.userStore.user.address;
    }
  }

  togglePaymentView(toggle) {
    animateScrollTo(this[toggle]);
    this.currentPaymentMethod = this.currentPaymentMethod === toggle ? '' : toggle;
  }

  payWithPaypal() {
    if (!this.validate()) {
      return;
    }
    this.state.inflight = true;
    this.api
      .create('me/requests', Object.assign({}, this.request, {active: false, status: 'paypal_pending'}))
      .then(request => {
        return this.api
          .create('integrations/paypal/payment', {
            intent: this.product.preorder ? 'authorize' : 'sale',
            urls: {
              return_url: `${window.location.origin}/user/requests/${request.id}/acknowledge`,
              cancel_url: `${window.location.origin}/user/requests/${request.id}/canceled`
            },
            payment_method: 'paypal',
            request: this.request
          });
      })
      .then(payment => {
        window.location.replace(payment.links[1].href);
      })
      .catch(err => {
        this.state.inflight = false;
        console.log(err);
      });
  }

  saveProof() {
    if (!this.validate()) {
      return;
    }
    this.request.status = 'verify';
    this.state.inflight = true;
    this.saveAddress(this.request.shipping_address);
    this.saveContact(this.tempUser);
    this.upload.uploadImages(this.proof, 'proof')
      .then(streams => {
        this.request.proof = streams.map(stream => stream.url.split('?')[0]);
        return this.api.create(`products/${this.product.id}/requests`, this.request);
      })
      .then(this.confirmPurchase.bind(this))
      .catch(err => this.errorReporting.report(new Error(err.message)));
  }

  selectOptions(selections) {
    if (selections.color) this.request.color = this.product.colors[selections.color];
    if (selections.size) this.request.size = this.product.sizes[selections.size];
    if (selections.variation) this.request.variation = this.product.variations[selections.variation];
  }
}
