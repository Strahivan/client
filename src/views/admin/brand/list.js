import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class BrandListView {
  brands = {
    params: {}
  }

  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  getBrands() {
    this.api
      .fetch('brands', this.brands.params)
      .then(data => this.brands.data = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getBrands();
  }
}

