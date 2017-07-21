import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {CountryStore} from '~/stores/country';
import {PriceService} from '~/services/price';

@inject(Api)
export class ShippingEstimator {
  product = {};
  constructor(api) {
    this.api = api;
    this.priceService = PriceService;
  }

  attached() {
    this.countries = CountryStore.countries;
  }

  calculate() {
    console.log(this.product);
    this.price = PriceService.calculatePrice(this.product);
  }
}
