import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

//factory of since we need to pass the path
@inject(Api, ErrorHandler)
export class RequestView {
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
    this.request = {
      params: {
        include: ['source', 'destination']
      }
    };
  }

  getRequest(id) {
    this.api
      .fetch(`requests/${id}/`, this.request.params)
      .then(request => {
        this.request.data = request;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params) {
    // construct model
    // TODO: clean up mixed ways of data retrieval
    const id = Number(params.request_id);
    this.getRequest(id);
  }
}
