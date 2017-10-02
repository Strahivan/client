import {inject} from 'aurelia-framework';
import {CountryStore} from '~/stores/country';
import {constants} from '~/services/constants';

function marginCalculator(cost, tiers) {
  const marginSpread = tiers.map(tier => {
    const rate = tier.rate / 100;
    if (cost > tier.min && cost < tier.max) {
      // if it's greater than min but less than max
      return (cost - tier.min) * rate;
    } else if (cost <= tier.min) {
      // if the product is lower than the price bracket
      return 0;
    } else if (tier.max === undefined) {
      // if highest tier has been reached
      return (cost - tier.min) * rate;
    }
    // by default, return the rate for the specific tier
    return (tier.max - tier.min) * rate;
  });

  return marginSpread.reduce((sum, current) => {
    return sum + current;
  }, 0);
}

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

@inject(CountryStore)
export class PriceService {

  constructor(countryStore) {
    this.countryStore = countryStore;
  }

  calculatePrice(product) {
    if (!(product && product.source_id)) {
      return 0;
    }
    const country = this.countryStore.countries.find((cntry) => cntry.id === product.source_id);
    const price = this.getCeiling(product.cost + marginCalculator(product.cost, country.tiers) + (product.weight * country.ems_fee) + (product.local_delivery_fee || 0) + (product.price_override || 0) + (product.cost && constants.defaultCourier), -1);
    return price || product.price + constants.defaultCourier;
  }

  getCeiling(value, exp) {
    return decimalAdjust('ceil', value, exp);
  }

  getDelta(request) {
    let delta = 0;
    if (request.size && request.size.delta) {
      delta = delta + request.size.delta;
    }
    if (request.color && request.color.delta) {
      delta = delta + request.color.delta;
    }
    if (request.variation && request.variation.delta) {
      delta = delta + request.variation.delta;
    }
    return delta;
  }

  getPrice(request, product) {
    return request.count * (product.price + this.getDelta(request) - (product.discount || 0));
  }
}

