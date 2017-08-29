import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {PriceService} from '~/services/price';

@inject(Router, PriceService)
export class ProductCard {
  @bindable product;
  constructor(router, priceService) {
    this.router = router;
    this.priceService = priceService;
  }

  attached() {
    this.product.price = this.priceService.calculatePrice(this.product);
  }

  showImage(index) {
    if (this.product.gallery[index]) {
      this.imgUrl = this.product.gallery[index];
    }
  }
}
