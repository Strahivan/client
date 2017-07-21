import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {UserStore} from '~/stores/user';
import {CountryStore} from '~/stores/country';
import {PriceService} from '~/services/price';

@inject(DialogController)
export class PriceEstimatorDialog {

  constructor(dialog) {
    this.dialog = dialog;
    this.user = UserStore.user;
    this.priceService = PriceService;
    this.countries = CountryStore.countries;
  }

  calculate() {
    this.price = PriceService.calculatePrice(this.product);
  }

}
