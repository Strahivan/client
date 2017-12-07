import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class CollectionsView {
  collections = {
    params: {}
  }
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  activate() {
    this.api
      .fetch('collections')
      .then(collections => this.collections.data = collections.results)
      .catch(this.errorHandler.notifyAndReport);
  }
}
