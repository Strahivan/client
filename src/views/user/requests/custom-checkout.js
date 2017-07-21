import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UploadService} from '~/services/upload';
import {UserStore} from '~/stores/user';
import {DialogController} from 'aurelia-dialog';
import {constants} from '~/services/constants';
import {notify} from '~/services/notification';

@inject(Api, DialogController, UploadService, UserStore)
export class CustomCheckoutDialog {
  state = {};
  constructor(api, controller, upload, userStore) {
    this.api = api;
    this.controller = controller;
    this.upload = upload;
    this.user = userStore.user;
  }

  activate(request) {
    this.request = request;
    this.updates = {};
    this.api.fetch('me/cards')
      .then(cards => {
        if (cards.data) {
          this.cards = cards.data;
        }
      })
      .catch(err => console.log(err));
  }

  saveProof() {
    this.request.status = 'verify';
    this.state.inflight = true;
    this.upload.uploadImages(this.proof, 'proof')
      .then(streams => {
        this.updates.proof = streams.map(stream => stream.url.split('?')[0]);
        this.updates.status = 'verify';
        return this.api.edit(`me/requests/${this.request.id}`, this.updates);
      })
      .then(success => {
        this.state.inflight = false;
        notify().log('Successfully placed order. Waiting for verification.');
        return this.controller.ok();
      })
      .catch(err => console.log(err));
  }

  togglePaymentView(toggle) {
    this.currentPaymentMethod = this.currentPaymentMethod === toggle ? '' : toggle;
  }

  saveAddress(address) {
    if (address && address.line_1 === constants.defaultShippingAddress.line_1) {
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

  charge(token) {
    this.state.inflight = true;
    this.saveAddress(this.request.shipping_address);
    // this.saveCountry(this.request.destination_id);
    (token ? this.api.create('me/cards', {token}) : Promise.resolve())
      .then(res => {
        const cardId = (res && res.card_id) || this.card;
        return this.api
          .create('me/charge', {amount: this.request.total_price, currency: 'SGD', source: cardId});
      })
      .then(response => {
        this.updates.stripe_charge_id = response.id;
        this.updates.status = 'confirmed';
        return this.api.edit(`me/requests/${this.request.id}`, this.updates);
      })
      .then(success => {
        this.state.inflight = false;
        notify().log('Successfully placed order');
        return this.controller.ok();
      })
      .catch(error => {
        this.state.inflight = false;
        // send error to admin
        console.log(error);
      });
  }
}