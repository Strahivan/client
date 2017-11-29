import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class CountryCreateView {
  constructor(api, errorHandler) {
    //TODO: Create a model for validation
    this.api = api;
    this.errorHandler = errorHandler;
  }

  create() {
    this.api.create('countries', this.country)
      .then(success => {
        notify().log('Successfully created!');
        this.country = {};
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}


