import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {CountryStore} from '~/stores/country';
import {constants} from '~/services/constants';
import {Router} from 'aurelia-router';
import {UrlExtraction} from '~/services/url-extraction';

@inject(Api, Router, UrlExtraction)
export class CustomOrderView {

  request = {
    product_details: {},
    shop_id: 1,
    status: 'pending',
    destination_id: constants.defaultDestination,
    collection_method: 'pickup'
  }

  constructor(api, router, extractor) {
    this.api = api;
    this.router = router;
    this.extractor = extractor;
    this.countries = CountryStore.countries;
  }

  getData(ur) {
    this.extractor.getUrlData(this.request.product_details.url)
    .then(data => {
      this.request.product_details.name = data.meta && data.meta.title;
      this.request.product_details.picture = data.links && data.links.thumbnail && data.links.thumbnail[0] && data.links.thumbnail[0].href;
    });
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
