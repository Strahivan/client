import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class BrandView {
  products = {}
  constructor(api) {
    this.api = api;
  }

  activate(param) {
    this.api
      .fetch(`brands/${param.brand_id}/products`)
      .then(products => {
        this.products.data = products.results;
        this.products.total = products.total;
      });
  }

}
