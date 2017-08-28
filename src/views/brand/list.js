import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

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

  activate() {
    this.api
      .fetch('brands', this.brands.params)
      .then(brands => this.brands.data = brands.results);
  }

}
