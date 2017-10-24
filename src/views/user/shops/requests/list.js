import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {Router} from 'aurelia-router';
import {CountryStore} from '~/stores/country';

@inject(Api, Router, CountryStore)
export class ShopRequestListVM {
  requests = {
    params: {
      include: ['product', 'customer'],
      filter: {},
      page: {
        size: 10,
        number: 0
      }
    }
  }
  shop = {};
  products = {};
  state = {};

  constructor(api, router, countryStore) {
    this.api = api;
    this.router = router;
    this.statuses = constants.requestStatus;
    this.countryStore = countryStore;
  }

  resetPageAndFetch() {
    this.requests.params.page.number = 0;
    this.getOrders();
  }

  getOrders() {
    this.api.fetch('requests', this.requests.params)
      .then(requests => {
        this.requests.data = requests.results;
        this.requests.total = requests.total;
      })
      .catch(err => console.log(err));
  }

  activate(params) {
    this.requests.params.filter['shop_id:eq'] = params.shop_id && Number(params.shop_id);

    this.params = params;

    this.getOrders();
    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(err => console.log(err));
    this.api.fetch(`me/shops/${params.shop_id}/products`, {page: {size: 1000}})
      .then(products => this.products.data = products.results)
      .catch(err => console.log(err));
  }
}
