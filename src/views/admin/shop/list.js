import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class ShopListView {
  shops = {
    params: {}
  }

  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  getShops() {
    this.api
    .fetch('shops', this.shops.params)
    .then(data => this.shops.data = data.results)
    .catch(this.errorHandler.notifyAndReport);
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getShops();
  }
}


