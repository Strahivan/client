import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';
import {AdwordsService} from '~/services/adwords';
import {UserStore} from '~/stores/user';
import animateScrollTo from 'animated-scroll-to';
import {OpenGraphMetadataService} from '~/services/open-graph';

@inject(Router, Api, AdwordsService, UserStore, PriceService)
export class ProductView {
  product = {
    params: {
      include: ['source', 'shop']
    }
  };
  request = {};
  selections = {};
  state = {};

  constructor(router, api, adwords, userStore, priceService) {
    this.router = router;
    this.api = api;
    this.adwords = adwords;
    this.userStore = userStore;
    this.priceService = priceService;
  }

  getProduct(id) {
    this.api
    .fetch(`products/${id}`, this.product.params)
    .then(product => {
      OpenGraphMetadataService.setMeta([
        {
          property: 'og:title',
          content: product.name
        },
        {
          property: 'og:image',
          content: product.gallery[0]
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:description',
          content: product.description
        },
        {
          property: 'og:url',
          content: window.location.href
        }
      ]);
      this.product.data = product;
      this.product.data.calculated_price = this.priceService.calculatePrice(this.product.data);
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
    params.count = this.request.count;
    return params;
  }

  getPrice() {
    this.request.total_price = this.priceService.getPrice(this.request, this.product.data);
  }

  confirm() {
    try {
      const selections = this.getParameters(this.product.data, this.request);
      this.adwords.reportBuyNowAction();
      this.router.navigateToRoute('checkout', selections);
    } catch (e) {
      console.log(e);
    }
  }

  activate(params) {
    this.getProduct(params.product_id);
    if (params.gclid) {
      this.adwords.gclid = params.gclid;
    }
  }
}
