import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';
import {AdwordsService} from '~/services/adwords';

@inject(Router, Api, AdwordsService)
export class ProductView {
  product = {
    params: {
      include: ['source']
    }
  };
  request = {};
  selections = {};

  constructor(router, api, adwords) {
    this.router = router;
    this.api = api;
    this.adwords = adwords;
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`, this.product.params)
    .then(product => {
      this.product.data = product;
      this.product.data.price = PriceService.calculatePrice(this.product.data);
      this.request = {
        total_price: (this.product.data.price || product.price) - (product.discount ? product.discount : 0),
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
