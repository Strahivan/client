import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {PriceService} from '~/services/price';

@inject(Router)
export class ProductCard {
  @bindable product;
  constructor(router) {
    this.router = router;
  }

  attached() {
    this.product.price = PriceService.calculatePrice(this.product);
  }

  showImage(index) {
    if (this.product.gallery[index]) {
      this.imgUrl = this.product.gallery[index];
    }
  }
}
