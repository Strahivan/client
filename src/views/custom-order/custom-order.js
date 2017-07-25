import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {CountryStore} from '~/stores/country';
import {constants} from '~/services/constants';
import {Router} from 'aurelia-router';

@inject(Api, Router)
export class CustomOrderView {

  request = {
    product_details: {},
    shop_id: 1,
    status: 'pending',
    destination_id: constants.defaultDestination,
    collection_method: 'pickup'
  }

  constructor(api, router, dialog) {
    this.api = api;
    this.router = router;
    this.countries = CountryStore.countries;
  }


  createOrder() {
    return this.api
      .create('requests', this.request)
      .then((request) => {
        notify().log('Successfully placed order');
        this.router.navigateToRoute('confirm');
      })
      .catch((err) => {
        notify().log(err.message);
      });
  }
}
