import {bindable} from 'aurelia-framework';

export class PaginationAjax {
  @bindable total;
  @bindable getData;
  @bindable page;

  state = {};

  totalChanged(old, newval) {
    if (this.currentMax > this.total) {
      this.state.disableNext = true;
    }
  }

  attached() {
    this.currentMax = (this.page.number + 1) * this.page.size;
    this.currentMin = (this.page.number - 1) * this.page.size;

    if (this.currentMax > this.total) {
      this.state.disableNext = true;
    }

    if (this.currentMin < 0) {
      this.state.disablePrev = true;
    }
  }

  next() {
    const currentMax = (this.page.number + 1) * this.page.size;

    if (currentMax < this.total) {
      this.page.number = page.number + 1;
      this.getData();
    }
  }

  prev() {
    const currentMin = (this.page.number - 1) * this.page.size;

    if (currentMin > 0) {
      this.page.number = page.number - 1;
      this.getData();
    }
  }
}
