import {inject} from 'aurelia-framework';
import {PriceService} from '~/services/price';

@inject(PriceService)
export class ToCurrencyValueConverter {
  constructor(priceService) {
    this.priceService = priceService;
  }

  toView(input) {
    if (!input) {
      return '';
    }
    const postDecimal = input.toString().split('.')[1] || [];
    let result;
    if (postDecimal.length === 1) {
      result = input.toString() + '0';
    }
    if (postDecimal.length === 0) {
      result = input.toString() + '.' + '00';
    }
    if (postDecimal.length > 1 ) {
      const ceilValue = this.priceService.getCeiling(input, -1);
      result = ceilValue.toString() + '0';
    }
    return result || 'not specified';
  }
}

