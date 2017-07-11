import {bindable, computedFrom} from 'aurelia-framework';
import {buildQueryString} from 'aurelia-path';

export class Pagination {
  @bindable total;
  @bindable path;
  @bindable params;
  @bindable size;

  attached() {
    this.nextParams = Object.assign({}, this.params);
    this.nextParams.page = Number(this.nextParams.page) + 1;
    this.prevParams = Object.assign({}, this.params);
    this.prevParams.page = Number(this.prevParams.page) - 1;
  }

  @computedFrom('total')
  get prevUrl() {
    if (this.prevParams && this.prevParams.page < 0) {
      this.prevElem.setAttribute('rel', 'nofollow');
      const newParams = Object.assign({}, this.prevParams);
      newParams.page = this.prevParams.page + 1;
      return `${this.path}?${buildQueryString(newParams)}`;
    }
    return `${this.path}?${buildQueryString(this.prevParams)}`;
  }

  @computedFrom('total')
  get nextUrl() {
    if (this.nextParams && this.total <= (this.nextParams.page * this.size)) {
      this.nextElem.setAttribute('rel', 'nofollow');
      const newParams = Object.assign({}, this.nextParams);
      newParams.page = this.nextParams.page - 1;
      return `${this.path}?${buildQueryString(newParams)}`;
    }
    return `${this.path}?${buildQueryString(this.nextParams)}`;
  }
}

