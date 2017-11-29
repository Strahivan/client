import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {HttpClient, json} from 'aurelia-fetch-client';
import {ErrorHandler} from '~/services/error';

@inject(Api, HttpClient, ErrorHandler)
export class Acknowledge {
  constructor(api, http, errorHandler) {
    this.api = api;
    this.http = http;
    this.errorHandler = errorHandler;
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
        const authorization = approved.transactions[0].related_resources[0].authorization;
        if (authorization) {
          updates.authorization_id = authorization.id;
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
        this.errorHandler.notifyAndReport(err, 'We were unable to complete the order. Please contact support: support@novelship.com');
      });
    }
  }
}
