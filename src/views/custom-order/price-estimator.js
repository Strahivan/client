import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {UserStore} from '~/stores/user';
import {CountryStore} from '~/stores/country';
import {PriceService} from '~/services/price';
import {Router} from 'aurelia-router';

@inject(DialogController, Router)
export class PriceEstimatorDialog {

  constructor(dialog, router) {
    this.dialog = dialog;
    this.user = UserStore.user;
    this.router = router;
    this.priceService = PriceService;
    this.countries = CountryStore.countries;
  }

  goToCustomPurchase() {
    this.router.navigateToRoute('custom-order');
    this.dialog.ok();
  }

  calculate() {
    this.price = PriceService.calculatePrice(this.product);
  }

}
