import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {activationStrategy} from 'aurelia-router';

@inject(Api)
export class BrandView {
  products = {
    params: {
      page: {
        size: 20,
        number: 0
      }
    }
  }
  constructor(api) {
    this.api = api;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }


  activate(params) {
    this.products.params.page.number = (params.page && Number(params.page)) || 0;
    this.params = Object.assign({}, params);
    this.params.page = this.params.page || 0;
    this.api
      .fetch(`brands/${params.brand_id}`)
      .then(brand => {
        this.brand = brand;
      })

    this.api
      .fetch(`brands/${params.brand_id}/products`, this.products.params)
      .then(products => {
        this.products.data = products.results;
        this.products.total = products.total;
      });
  }

}
