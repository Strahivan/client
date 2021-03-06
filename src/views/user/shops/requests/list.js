import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {Router} from 'aurelia-router';
import {CountryStore} from '~/stores/country';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, Router, CountryStore, ErrorHandler)
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

  batches = {
    params: {
      filter: {
        'closed:eq': false
      }
    }
  }
  shop = {};
  state = {};
  selectedRequests = [];

  constructor(api, router, countryStore, errorHandler) {
    this.api = api;
    this.router = router;
    this.errorHandler = errorHandler;
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
      .catch(this.errorHandler.notifyAndReport);
  }

  addToBatch(batchId) {
    Promise.all(this.selectedRequests.map(requestId => {
      return this.api.edit(`shops/${this.params.shop_id}/requests/${requestId}`, {batch_id: Number(batchId)});
    }))
      .then(success => this.selectedRequests = [])
      .catch(this.errorHandler.notifyAndReport);
    this.getOrders();
    notify().log('Successfully added');
  }

  activate(params) {
    this.requests.params.filter['shop_id:eq'] = params.shop_id && Number(params.shop_id);
    this.batches.params.filter['shop_id:eq'] = params.shop_id && Number(params.shop_id);
    this.requests.params.filter['batch_id:eq'] = params.batch_id && Number(params.batch_id);


    this.params = params;

    this.getOrders();
    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(this.errorHandler.notifyAndReport);

    this.api
      .fetch(`me/shops/${params.shop_id}/batches`, this.batches.params)
      .then(batches => {
        this.batches.data = batches.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}
