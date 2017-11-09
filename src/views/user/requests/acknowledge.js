import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class Acknowledge {
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    if (params.paymentId && params.PayerID) {
      this.loading = true;
      this.api
      .create('integrations/paypal/execute', {payer_id: params.PayerID, payment_id: params.paymentId})
      .then((approved) => {
        // if authorization then preorder
        const updates = {};
        if (approved.transactions[0].related_resources[0].authorization) {
          updates.authorization_id = approved.transactions[0].related_resources[0].authorization.id;
        }
        updates.status = 'confirmed';
        updates.payment_method = 'paypal';
        updates.payment_id = approved.id;
        return this.api.edit(`me/requests/${params.request_id}`, updates);
      })
      .then(success => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        console.log(err)
      });
    }
  }
}
