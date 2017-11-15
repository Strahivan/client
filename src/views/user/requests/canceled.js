import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';

@inject(Api, Router)
export class Canceled {
  constructor(api, router) {
    this.api = api;
    this.router = router;
  }

  activate(params) {
    this.api.edit(`me/requests/${params.request_id}`, {status: 'canceled', active: false})
      .then(result => console.log(result))
      .catch(err => console.log(err));

    this.api.fetch(`me/requests/${params.request_id}`)
      .then((request) => setTimeout(() => window.location.href = `products/${request.product_id}`, 3000))
      .catch(err => console.log(err));
  }
}
