import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';

@inject(Api)
export class BatchCreateView {
  batch = {};
  constructor(api) {
    this.api = api;
  }

  async activate(params) {
    this.batch.shop_id = params.shop_id;
    this.countries = (await this.api.fetch('countries')).results;
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
      .catch(err => console.log(err));
  }
}
