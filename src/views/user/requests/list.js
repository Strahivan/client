import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class RequestListVM {
  requests = {
    params: {
      include: ['product']
    }
  }
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.api.fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(this.errorHandler.notifyAndReport);
  }
}
