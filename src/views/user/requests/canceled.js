import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, Router, ErrorHandler)
export class Canceled {
  constructor(api, router, errorHandler) {
    this.api = api;
    this.router = router;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.api.edit(`me/requests/${params.request_id}`, {status: 'paypal_canceled'})
      .catch(err => this.errorHandler.notifyAndReport(err, 'We were unable to process the request. Please contact support: support@novelship.com'));

    this.api.fetch(`me/requests/${params.request_id}`)
      .then((request) => setTimeout(() => window.location.href = `products/${request.product_id}`, 3000))
      .catch(err => this.errorHandler.notifyAndReport(err, 'We were unable to process the request. Please contact support: support@novelship.com'));
  }
}
