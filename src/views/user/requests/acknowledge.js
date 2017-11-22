import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {HttpClient, json} from 'aurelia-fetch-client';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, HttpClient, ErrorReporting)
export class Acknowledge {
  constructor(api, http, errorReporting) {
    this.api = api;
    this.http = http;
    this.errorReporting = errorReporting;
  }

  activate(params) {
    if (params.paymentId && params.PayerID) {
      this.loading = true;
      this.http
      .fetch(`integrations/paypal/execute?payer_id=${params.PayerID}&payment_id=${params.paymentId}`)
      .then(response => response.json())
      .then((approved) => {
        // if authorization then preorder
        const updates = {};
        if (approved.transactions[0].related_resources[0].authorization) {
          updates.authorization_id = approved.transactions[0].related_resources[0].authorization.id;
        }
        updates.status = 'confirmed';
        updates.payment_method = 'paypal';
        updates.payment_id = approved.id;
        updates.active = true;
        return this.http
          .fetch(`me/requests/${params.request_id}`, {
            method: 'PUT',
            body: json(updates)
          })
          .then(res => res.json());
      })
      .then(success => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.errorReporting.notifyAndReport(err, 'We were unable to complete the order. Please contact support: support@novelship.com');
      });
    }
  }
}
