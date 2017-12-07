import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class RequestView {
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
    this.requests = {
      params: {
        filter: {},
        include: [],
        page: {
          size: 12,
          number: 0
        },
        sort: '-id'
      }
    };
    this.countries = {};
  }

  getRequests(params) {
    // console.log(params);
    this.api
      .fetch('requests', params)
      .then(items => {
        this.requests.data = items.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(items => {
        this.countries.data = items.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate() {
    this.getRequests(this.requests.params);
    this.getCountries();
  }
}
