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

  activate(params) {
    this.query = {};
    this.query.page = (params && params.page) || 0;

    this.brands.params.page.number = (params.page && Number(params.page)) || 0;

    this.api
      .fetch('brands', this.brands.params)
      .then(brands => {
        this.brands.total = brands.total;
        this.brands.data = brands.results;
      });
  }

}
