import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {CountryStore} from '~/stores/country';
import {ErrorHandler} from '~/services/error';

@inject(Api, CountryStore, ErrorHandler)
export class BatchCreateView {
  batch = {};
  constructor(api, countryStore, errorHandler) {
    this.api = api;
    this.countries = countryStore.countries;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.batch.shop_id = params.shop_id;
  }

  create() {
    const selectedCountry = this.countries.find(country => country.id === this.batch.source_id);
    this.api
      .create('batches', this.batch)
      .then(batch => {
        notify().log('Successfully Created');
        this.api.edit(`batches/${batch.id}`, {name: `${selectedCountry.shortcode} #${batch.id}`});
        this.batch = {shop_id: this.batch.shop_id};
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}
