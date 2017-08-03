import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';

@inject(Router)
export class ProductCard {
  @bindable product;
  constructor(router) {
    this.router = router;
  }

  showImage(index) {
    if (this.product.gallery[index]) {
      this.imgUrl = this.product.gallery[index];
    }
  }

}
