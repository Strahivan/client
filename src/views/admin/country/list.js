import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class CountryListView {
  countries = {
    params: {}
  }

  constructor(api, errorHandler) {
    this.api = api;
    this.api = errorHandler;
  }

  getCountries() {
    this.api
      .fetch('countries', this.countries.params)
      .then(data => this.countries.data = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCountries();
  }
}


