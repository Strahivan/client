import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {CountryStore} from '~/stores/country';
import {constants} from '~/services/constants';
import {Router} from 'aurelia-router';
import {UrlExtraction} from '~/services/url-extraction';
import {CustomOrder} from './custom-order.model';
import {DialogService} from 'aurelia-dialog';
import {PriceEstimatorDialog} from '~/views/custom-order/price-estimator';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';

@inject(Api, Router, UrlExtraction, NewInstance.of(ValidationController), DialogService)
export class CustomOrderView {
  request = new CustomOrder();

  init = {
    product_details: {},
    shop_id: 1,
    status: 'pending',
    destination_id: constants.defaultDestination,
    collection_method: 'pickup',
    count: 1
  }

  calculator() {
    this.dialog.open({ viewModel: PriceEstimatorDialog })
      .whenClosed(response => {
        console.log(response);
      });
  }

  constructor(api, router, extractor, controller, dialog) {
    this.api = api;
    this.router = router;
    this.dialog = dialog;
    this.extractor = extractor;
    this.controller = controller;
    this.countries = CountryStore.countries;

    Object.assign(this.request, this.init);
    this.controller.addRenderer(new ValidationRenderer());
  }

  getData(ur) {
    this.extractor.getUrlData(this.request.url)
    .then(data => {
      this.request.product_details.name = data.meta && data.meta.title;
      this.request.product_details.picture = data.links && data.links.thumbnail && data.links.thumbnail[0] && data.links.thumbnail[0].href;
    })
    .catch(err => errorReporting.report(new Error(err.message)));
  }

  createOrder() {
    this.controller.validate()
    .then(result => {
      if (result.valid) {
        this.request.product_details.url = this.request.url;
        return this.api
          .create('requests', this.request);
      }
      throw new Error('invalid custom order');
    })
    .then((response) => {
      notify().log('Successfully placed order');
      return this.router.navigateToRoute('confirm');
    })
    .catch(err => errorReporting.report(new Error(err.message)));
  }
}
