import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {EventAggregator} from 'aurelia-event-aggregator';
import {Router} from 'aurelia-router';
import {activationStrategy} from 'aurelia-router';
import {ErrorHandler} from '~/services/error';

@inject(Api, EventAggregator, Router, ErrorHandler)
export class FilterView {
  errors = {};
  products = {
    params: {
      filter: {},
      include: ['source', 'shop'],
      page: {
        size: 16,
        number: 0
      },
      sort: '-id'
    }
  };

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  constructor(api, ea, router, errorHandler) {
    this.api = api;
    this.router = router;
    this.errorHandler = errorHandler;
    ea.subscribe('filter__search', payload => {
      this.products.params.filter['tsv:search'] = payload;
      this.reload(this.products.params);
    });
  }

  reload(params) {
    const query = {
      source: params.filter['source_id:eq'],
      search: params.filter['tsv:search'],
      category: params.filter['category_id:eq'],
      sort: params.sort,
      page: params.page.number
    };

    this.router.navigateToRoute('filter', query);
  }

  resetPageAndFetch() {
    this.products.params.page.number = 0;
    this.reload(this.products.params);
  }

  getProducts() {
    // this.replaceUrlWithParams(this.products.params);
    this.api
      .fetch('products', this.products.params)
      .then(items => {
        this.products.data = items.results.map(product => {
          return product;
        });
        this.products.total = items.total;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getCategories() {
    this.api
      .fetch('categories')
      .then(data => {
        this.categories = data.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(data => {
        this.countries = data.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params) {
    this.products.params.filter['tsv:search'] = params.search;
    this.products.params.filter['category_id:eq'] = params.category && Number(params.category);
    this.products.params.filter['source_id:eq'] = params.source && Number(params.source);
    this.products.params.sort = params.sort;
    this.products.params.page.number = (params.page && Number(params.page)) || 0;

    this.params = Object.assign({}, params);
    this.params.page = this.params.page || 0;

    this.getProducts();
    this.getCategories();
    this.getCountries();
  }
}
