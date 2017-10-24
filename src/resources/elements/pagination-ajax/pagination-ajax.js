import {bindable} from 'aurelia-framework';
import animatedScrollTo from 'animated-scroll-to';

export class PaginationAjax {
  @bindable total;
  @bindable getData;
  @bindable page;

  state = {};

  next() {
    const currentMax = (this.page.number + 1) * this.page.size;

    if (currentMax < this.total) {
      this.page.number = this.page.number + 1;
      this.getData();
      animatedScrollTo(0);
    }
  }

  prev() {
    const currentMin = (this.page.number - 1) * this.page.size;

    if (currentMin >= 0) {
      this.page.number = this.page.number - 1;
      this.getData();
      animatedScrollTo(0);
    }
  }
}
