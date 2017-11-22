import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, Router, ErrorReporting)
export class Canceled {
  constructor(api, router, errorReporting) {
    this.api = api;
    this.router = router;
    this.errorReporting = errorReporting;
  }

  activate(params) {
    this.api.edit(`me/requests/${params.request_id}`, {status: 'paypal_canceled'})
      .then(result => console.log(result))
      .catch(err => this.errorReporting.notifyAndReport(err, 'We were unable to process the request. Please contact support: support@novelship.com'));

    this.api.fetch(`me/requests/${params.request_id}`)
      .then((request) => setTimeout(() => window.location.href = `products/${request.product_id}`, 3000))
      .catch(err => this.errorReporting.notifyAndReport(err, 'We were unable to process the request. Please contact support: support@novelship.com'));
  }
}
