import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {CountryStore} from '~/stores/country';
import {PriceService} from '~/services/price';
import {Router} from 'aurelia-router';

@inject(DialogController, Router, CountryStore, PriceService)
export class PriceEstimatorDialog {

  constructor(dialog, router, countryStore, priceService) {
    this.dialog = dialog;
    this.router = router;
    this.priceService = priceService;
    this.countries = countryStore.countries.filter(country => {
      return country.name !== 'Singapore';
    });
  }

  goToCustomPurchase() {
    this.router.navigateToRoute('custom-order');
    this.dialog.ok();
  }

  calculate() {
    this.price = this.priceService.calculatePrice(this.product);
  }

}
