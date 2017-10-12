import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class Payment {
  constructor(api) {
    this.api = api;
  }

  saveCard(token) {
    return this.api.create('me/cards', {token: token})
      .then(response => response.json());
  }

  getCards() {
    return this.api.fetch('me/cards');
  }

  charge(amount, currency, source, shop_stripe_id) {
    return this.api.create('me/charge', {amount, currency, source, shop_stripe_id})
      .then(response => response.json());
  }

  deleteCard(cardId) {
    return this.api.remove(`me/cards/${cardId}`)
      .then(response => response.json());
  }
}
