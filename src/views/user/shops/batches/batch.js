import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {activationStrategy} from 'aurelia-router';
import {Router} from 'aurelia-router';
import {CountryStore} from '~/stores/country';
import {ErrorHandler} from '~/services/error';

@inject(Api, Router, CountryStore, ErrorHandler)
export class BatchView {
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

  constructor(api, router, countryStore, errorHandler) {
    this.api = api;
    this.router = router;
    this.statuses = constants.requestStatus;
    this.countryStore = countryStore;
    this.errorHandler = errorHandler;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  reload(params) {
    const query = {
      status: params.filter['status:eq'],
      email: params.filter['customer.email:eq'],
      source: params.filter['source_id:eq'],
      product: params.filter['product_id:eq'],
      batch: params.filter['batch_id:eq'],
      page: params.page.number
    };

    this.router.navigateToRoute('batchView', query);
  }

  resetPageAndFetch() {
    this.requests.params.page.number = 0;
    this.reload(this.requests.params);
  }

  getOrders() {
    this.api.fetch(`me/shops/${this.params.shop_id}/requests`, this.requests.params)
      .then(requests => {
        this.requests.data = requests.results;
        this.requests.total = requests.total;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params, config, instruction) {
    this.path = window.location.pathname.substring(1);
    this.query = Object.assign({}, instruction.queryParams);

    this.query.page = this.query.page || 0;
    this.requests.params.filter['status:eq'] = this.query.status;
    this.requests.params.filter['customer.email:eq'] = this.query.email;
    this.requests.params.filter['source_id:eq'] = this.query.source && Number(this.query.source);
    this.requests.params.filter['product_id:eq'] = this.query.product && Number(this.query.product);
    this.requests.params.filter['batch_id:eq'] = this.query.product && Number(this.query.batch);
    this.requests.params.page.number = (this.query.page && Number(this.query.page)) || 0;

    this.params = params;

    this.getOrders();
    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(this.errorHandler.notifyAndReport);

    this.api.fetch(`me/shops/${params.shop_id}/products`, {page: {size: 1000}})
      .then(products => this.products.data = products.results)
      .catch(this.errorHandler.notifyAndReport);
  }
}
