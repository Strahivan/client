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
import {UserStore} from '~/stores/user';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, Router, UrlExtraction, CountryStore, NewInstance.of(ValidationController), DialogService, UserStore, ErrorReporting)
export class CustomOrderView {
  request = new CustomOrder();

  init = {
    product_details: {},
    shop_id: 1,
    collection_method: 'courier',
    status: 'pending',
    destination_id: constants.defaultDestination,
    count: 1
  }

  state = {
    inflight: false
  };

  userdata = {};

  constructor(api, router, extractor, countryStore, controller, dialog, userStore, errorReporting) {
    this.api = api;
    this.router = router;
    this.dialog = dialog;
    this.extractor = extractor;
    this.controller = controller;
    this.countryStore = countryStore;
    this.userStore = userStore;
    this.errorReporting = errorReporting;

    Object.assign(this.request, this.init);
    this.controller.addRenderer(new ValidationRenderer());
  }

  calculator() {
    this.dialog.open({ viewModel: PriceEstimatorDialog })
      .whenClosed(response => {
        console.log(response);
      });
  }

  getData(ur) {
    this.extractor.getUrlData(this.request.url)
    .then(data => {
      this.request.product_details.name = data.meta && data.meta.title;
      this.request.product_details.picture = data.links && data.links.thumbnail && data.links.thumbnail[0] && data.links.thumbnail[0].href;
    })
    .catch(err => this.errorReporting.report(new Error(err.message)));
  }

  createOrder() {
    this.state.inflight = true;
    this.controller.validate()
    .then(result => {
      if (result.valid) {
        this.request.product_details.url = this.request.url;
        if (this.userdata.phone || this.userdata.email) {
          this.api
            .edit('me', this.userdata);
        }

        return this.api
          .create('requests', this.request);
      }
      throw new Error('invalid custom order');
    })
    .then((response) => {
      this.state.inflight = false;
      notify().log('Successfully placed order');
      return this.router.navigateToRoute('confirm');
    })
    .catch(err => {
      this.state.inflight = false;
      this.errorReporting.report(new Error(err.message));
    });
  }
}
