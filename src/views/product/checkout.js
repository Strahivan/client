import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UserStore} from '~/stores/user';
import {Router} from 'aurelia-router';
import {constants} from '~/services/constants';
import {UploadService} from '~/services/upload';
import {PriceService} from '~/services/price';
import {AdwordsService} from '~/services/adwords';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Router, Api, UserStore, UploadService, AdwordsService, ErrorReporting)
export class CheckoutVM {
  error = {};
  request = {
    shipping_address: {}
  };
  cards = [];

  constructor(router, api, userStore, upload, adwords, errorReporting) {
    this.router = router;
    this.api = api;
    this.user = userStore.user;
    this.upload = upload;
    this.adwords = adwords;
    this.constants = constants;
    this.priceService = PriceService;
    this.errorReporting = errorReporting;

    this.state = {
      addcard: false,
      error: {}
    };
  }

  activate(params) {
    this.api.fetch('countries')
      .then(countries => this.countries = countries.results)
      .catch(err => errorReporting.report(new Error(err.message)));

    this.api.fetch('me/cards')
      .then(cards => {
        if (cards.data) {
          this.cards = cards.data;
        }
      })
      .catch(err => errorReporting.report(new Error(err.message)));

    this.getProduct(Number(params.product_id), params);
  }

  getBufferDays(countryId) {
    const bufferMap = {
      1: 3, // korea
      2: 4  // japan
    };
    return bufferMap[countryId];
  }

  getProduct(id, selections) {
    this.api
      .fetch(`products/${id}`, {include: ['source']})
      .then(product => {
        this.product = product;
        const currentDay = new Date();
        const deliveryDate = new Date(currentDay.setDate(currentDay.getDate() + (product.delivery_time || 10) + this.getBufferDays(product.source_id)));
        this.request = {
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
          postage: product.courier || constants.defaultCourier,
          destination_id: this.user && this.user.country_id || constants.defaultDestination,
          collection_method: 'courier',
          count: Number(selections.count),
          shipping_address: (this.user && this.user.address) || {line_1: '', line_2: '', zip: '', city: ''},
          delivery_date: deliveryDate.toISOString()
        };
        this.selectOptions(selections);
        this.request.total_price = PriceService.getPrice(this.request, this.product);
      })
      .catch(err => errorReporting.report(new Error(err.message)));
  }

  getPrice() {
    this.request.total_price = PriceService.getPrice(this.request, this.product);
  }

  charge(token) {
    if (!this.validate()) {
      return;
    }
    this.state.inflight = true;
    this.saveAddress(this.request.shipping_address);
    this.savePhone(this.user.phone);
    this.saveCountry(this.request.destination_id);
    (token ? this.api.create('me/cards', {token}) : Promise.resolve())
      .then(res => {
        const cardId = (res && res.card_id) || this.card;
        return this.api
          .create('me/charge', {amount: this.request.total_price, currency: 'SGD', source: cardId});
      })
      .then(response => {
        this.request.stripe_charge_id = response.id;
        return this.api.create(`products/${this.product.id}/requests`, this.request);
      })
      .then(this.confirmPurchase.bind(this))
      .catch(err => {
        this.state.inflight = false;
        return errorReporting.report(new Error(err.message));
      });
  }

  confirmPurchase() {
    return this.api.edit(`products/${this.product.id}`, {order_count: this.product.order_count ? this.product.order_count + 1 : 1})
      .then(response => {
        this.adwords.reportSales(this.request.total_price);
        this.router.navigateToRoute('acknowledge');
      });
  }

  validate() {
    if (this.request.collection_method === 'courier') {
      if (!this.user.phone) {
        this.state.error.phoneRequired = true;
        throw new Error('phone required');
      }
      if (!this.request.shipping_address.line_1) {
        this.state.error.addressRequired = true;
        throw new Error('Address required');
      }
      if (!this.request.shipping_address.zip) {
        this.state.error.zipRequired = true;
        throw new Error('Zip required');
      }
    }

    if (this.currentPaymentMethod === 'bank-payment') {
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

    if (this.user && !this.user.address) {
      this.user.address = address;
      this.api.edit('me', { address: address })
        .then(success => console.log(success));
    }
  }

  saveCountry(countryId) {
    if (!this.user.country_id) {
      this.user.country_id = countryId;
      this.api.edit('me', { country_id: countryId })
        .then(success => console.log(success));
    }
  }

  savePhone(phone) {
    if (this.state.changedPhone) {
      this.api.edit('me', {phone: phone})
      .then(success => console.log(success));
    }
  }

  toggleAddress() {
    if (this.request.collection_method === 'pickup') {
      this.request.shipping_address = this.constants.defaultShippingAddress;
    } else if (this.request.collection_method === 'courier') {
      this.request.shipping_address = this.user && this.user.address;
    }
  }

  togglePaymentView(toggle) {
    this.currentPaymentMethod = this.currentPaymentMethod === toggle ? '' : toggle;
  }

  saveProof() {
    if (!this.validate()) {
      return;
    }
    this.request.status = 'verify';
    this.state.inflight = true;
    this.upload.uploadImages(this.proof, 'proof')
      .then(streams => {
        this.request.proof = streams.map(stream => stream.url.split('?')[0]);
        return this.api.create(`products/${this.product.id}/requests`, this.request);
      })
      .then(this.confirmPurchase.bind(this))
      .catch(err => errorReporting.report(new Error(err.message)));
  }

  selectOptions(selections) {
    if (selections.color) this.request.color = this.product.colors[selections.color];
    if (selections.size) this.request.size = this.product.sizes[selections.size];
    if (selections.variation) this.request.variation = this.product.variations[selections.variation];
  }
}
