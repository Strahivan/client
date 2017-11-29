import {Api} from '~/services/api';
import {inject} from 'aurelia-framework';
import {activationStrategy} from 'aurelia-router';
import {Router} from 'aurelia-router';
import {DialogService} from 'aurelia-dialog';
import {ConfirmationDialog} from '~/resources/dialogs/confirmation/confirmation';
import {ErrorHandler} from '~/services/error';

@inject(Api, Router, DialogService, ErrorHandler)
export class ShopProductListVM {
  shop = {};
  products = {
    params: {
      filter: {},
      page: {
        size: 20,
        number: 0
      }
    }
  };
  countries = {};
  categories = {};

  constructor(api, router, dialog, errorHandler) {
    this.api = api;
    this.router = router;
    this.dialog = dialog;
    this.errorHandler = errorHandler;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  reload(params) {
    const query = {
      search: params.filter['tsv:search'],
      category: params.filter['category_id:eq'],
      country: params.filter['source_id:eq'],
      breakdown: params.filter['cost:isNull'],
      page: params.page.number
    };

    this.router.navigateToRoute('shopProductList', query);
  }

  resetPageAndFetch() {
    this.products.params.page.number = 0;
    this.reload(this.products.params);
  }

  getProducts() {
    this.api.fetch(`me/shops/${this.params.shop_id}/products`, this.products.params)
      .then(products => {
        this.products.data = products.results;
        this.products.total = products.total;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params, config, instruction) {
    this.path = window.location.pathname.substring(1);
    this.query = Object.assign({}, instruction.queryParams);

    this.query.page = this.query.page || 0;
    this.products.params.filter['category_id:eq'] = this.query.category && Number(this.query.category);
    this.products.params.filter['tsv:search'] = this.query.search;
    this.products.params.filter['source_id:eq'] = this.query.country && Number(this.query.country);
    this.products.params.page.number = (this.query.page && Number(this.query.page)) || 0;

    if (this.query.breakdown === 'true') {
      this.products.params.filter['cost:isNull'] = true;
    }

    this.params = params;
    this.getProducts();

    this.api.fetch(`me/shops/${params.shop_id}`)
      .then(shop => this.shop.data = shop)
      .catch(this.errorHandler.notifyAndReport);

    this.api
      .fetch('countries')
      .then(data => this.countries.data = data.results)
      .catch(this.errorHandler.notifyAndReport);

    this.api
      .fetch('categories')
      .then(data => this.categories.data = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  action(selectedAction, product) {
    selectedAction.call(this, product);
  }

  delete(product) {
    this.dialog.open({ viewModel: ConfirmationDialog, model: {message: 'Are you sure to delete this product?'}})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          product.deleted = true;
          this.api.edit(`me/shops/${this.params.shop_id}/products/${product.id}`, {active: false});
        }
      });
  }

  soldOut(product) {
    this.dialog.open({ viewModel: ConfirmationDialog, model: {message: 'Are you sure to mark it as sold out?'}})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          product.out_of_stock = true;
          this.api.edit(`me/shops/${this.params.shop_id}/products/${product.id}`, {out_of_stock: true});
        }
      });
  }

}

