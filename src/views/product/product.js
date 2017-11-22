import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';
import {UserStore} from '~/stores/user';
import animateScrollTo from 'animated-scroll-to';
import {setOpenGraphElements, setProductJsonLd, setProductBreadCrumb} from '~/services/metadata';

@inject(Router, Api, UserStore, PriceService)
export class ProductView {
  product = {
    params: {
      include: ['source', 'shop', 'brand', 'category']
    }
  };
  request = {
    count: 1
  };
  selections = {};
  state = {};

  constructor(router, api, userStore, priceService) {
    this.router = router;
    this.api = api;
    this.userStore = userStore;
    this.priceService = priceService;
  }

  getParameters(product, request) {
    const params = {};
    if ((product.colors && !request.color) || (product.sizes && !request.size) || (product.variations && !request.variation)) {
      this.state.showSelectionError = true;
      animateScrollTo(400);
      throw new Error('Please make your selection');
    }
    this.state.showSelectionError = true;
    if (product.colors) {
      params.color = product.colors.map(color => color.name).indexOf(request.color.name);
    }
    if (product.sizes) {
      params.size = product.sizes.map(size => size.name).indexOf(request.size.name);
    }
    if (product.variations) {
      params.variation = product.variations.map(variation => variation.name).indexOf(request.variation.name);
    }
    return params;
  }

  getPrice() {
    this.request.total_price = this.priceService.getPrice(this.request, this.product.data);
  }

  confirm() {
    try {
      const selections = this.getParameters(this.product.data, this.request);
      this.router.navigateToRoute('checkout', selections);
    } catch (e) {
      console.log(e);
    }
  }

  activate(params) {
    this.api
    .fetch(`products/${params.product_id}`, this.product.params)
    .then(product => {
      this.product.data = product;
      this.request.total_price = product.price - (product.discount || 0);
      const d = document.getElementById('product-container');
      setOpenGraphElements('product', this.product.data);
      setProductJsonLd(this.product.data, d);
      setProductBreadCrumb(this.product.data, d);
    })
    .catch(error => {
      console.log(error);
    });
  }
}
