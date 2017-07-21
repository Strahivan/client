import {PriceService} from '~/services/price';

export class ToCurrencyValueConverter {
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
      const ceilValue = PriceService.getCeiling(input, -1);
      result = ceilValue.toString();
    }
    return result || 'not specified';
  }
}

