import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

@inject(Api)
export class BrandListView {
  constructor(api) {
    this.api = api;
  }

  activate() {
    this.api
      .fetch('brands')
      .then(brands => this.brands = brands.results);
  }

}
