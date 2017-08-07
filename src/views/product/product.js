import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';
import {AdwordsService} from '~/services/adwords';
import {UserStore} from '~/stores/user';

@inject(Router, Api, AdwordsService, UserStore)
export class ProductView {
  product = {
    params: {
      include: ['source', 'shop']
    }
  };
  request = {};
  selections = {};

  constructor(router, api, adwords, userStore) {
    this.router = router;
    this.api = api;
    this.adwords = adwords;
    this.user = userStore.user;
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`, this.product.params)
    .then(product => {
      this.product.data = product;
      this.product.data.calculated_price = PriceService.calculatePrice(this.product.data);
      this.request = {
        total_price: (this.product.data.calculated_price || product.price) - (product.discount ? product.discount : 0),
        count: 1
      };
    })
    .catch(error => {
      console.log(error);
    });
  }

  getParameters(product, request) {
    const params = {};
    if (product.colors) {
      params.color = product.colors.map(color => color.name).indexOf(request.color.name);
    }
    if (product.sizes) {
      params.size = product.sizes.map(size => size.name).indexOf(request.size.name);
    }
    if (product.variations) {
      params.variation = product.variations.map(variation => variation.name).indexOf(request.variation.name);
    }
    params.count = this.request.count;
    return params;
  }

  getPrice() {
    this.request.total_price = PriceService.getPrice(this.request, this.product.data);
  }

  confirm() {
    const selections = this.getParameters(this.product.data, this.request);
    this.adwords.reportBuyNowAction();
    this.router.navigateToRoute('checkout', selections);
  }

  activate(params) {
    this.getProduct(params.product_id);
    if (params.gclid) {
      this.adwords.gclid = params.gclid;
    }
  }
}
