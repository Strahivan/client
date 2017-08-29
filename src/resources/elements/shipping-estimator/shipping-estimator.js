import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {CountryStore} from '~/stores/country';
import {PriceService} from '~/services/price';

@inject(Api, PriceService)
export class ShippingEstimator {
  product = {};
  constructor(api, priceService) {
    this.api = api;
    this.priceService = priceService;
  }

  attached() {
    this.countries = CountryStore.countries;
  }

  calculate() {
    this.price = this.priceService.calculatePrice(this.product);
  }
}
