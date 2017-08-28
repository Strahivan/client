import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {activationStrategy} from 'aurelia-router';

@inject(Api)
export class BrandListView {
  brands = {
    params: {
      page: {
        size: 24
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
    this.brands.params.page.number = (params.page && Number(params.page)) || 0;
    this.params = Object.assign({}, params);
    this.params.page = this.params.page || 0;

    this.api
      .fetch('brands', this.brands.params)
      .then(brands => {
        this.brands.total = brands.total;
        this.brands.data = brands.results;
      });
  }

}
