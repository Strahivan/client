import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {activationStrategy} from 'aurelia-router';
import {Router} from 'aurelia-router';

@inject(Api, Router)
export class ShopRequestListVM {
  requests = {
    params: {
      include: ['product', 'customer'],
      filter: {
        'status:eq': 'pending'
      },
      page: {
        size: 10,
        number: 0
      }
    }
  }
  shop = {};
  products = {};

  constructor(api, router) {
    this.api = api;
    this.router = router;
    this.statuses = constants.requestStatus;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  reload(params) {
    const query = {
      status: params.filter['status:eq'],
      created_at_gt: params.filter['created_at:gt'],
      created_at_lt: params.filter['createtd_at:lt'],
      product: params.filter['product_id:eq'],
      page: params.page.number
    };

    this.router.navigateToRoute('userRequestList', query);
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
      .catch(err => console.log(err));
  }

  activate(params, config, instruction) {
    this.path = window.location.pathname.substring(1);
    this.query = Object.assign({}, instruction.queryParams);

    this.query.page = this.query.page || 0;
    this.requests.params.filter['status:eq'] = this.query.status || 'pending';
    this.requests.params.filter['created_at:gt'] = this.query.created_at_gt && (new Date(this.query.created_at_gt)).toISOString();
    this.requests.params.filter['created_at:lt'] = this.query.created_at_lt && (new Date(this.query.created_at_lt)).toISOString();
    this.requests.params.filter['product_id:eq'] = this.query.product && Number(this.query.product);
    this.requests.params.page.number = (this.query.page && Number(this.query.page)) || 0;

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
