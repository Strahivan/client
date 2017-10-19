import {inject, bindable} from 'aurelia-framework';
import {ErrorReporting} from '~/services/error-reporting';
import {notify} from '~/services/notification';
import {Api} from '~/services/api';

@inject(Api, ErrorReporting)
export class CardPayment {
  @bindable amount;
  @bindable onSuccess;

  // assumes that parent controller has state and paymentMethod properties
  constructor(api, errorReporting) {
    this.api = api;
    this.errorReporting = errorReporting;
    this.api.fetch('me/cards')
      .then(cards => {
        if (cards.data) {
          this.cards = cards.data;
        }
      })
      .catch(err => errorReporting.report(new Error(err.message)));
  }

  bind(bindingContext, overrideContext) {
    this.parent = bindingContext;
  }

  charge(token) {
    this.parent.state.inflight = true;
    (token ? this.api.create('me/cards', {token}) : Promise.resolve())
      .then(res => {
        const cardId = (res && res.card_id) || this.selectedCard;
        return this.api
          .create('me/charge', {amount: this.amount, currency: 'SGD', source: cardId});
      })
      .then((charge) => this.onSuccess({stripeChargeId: charge.id}))
      .catch(err => {
        notify().log(err);
        this.parent.state.inflight = false;
        return this.errorReporting.report(new Error(err.message));
      });
  }
}
