import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class FilaGiveAway {
  state = {};

  terms = '</span> 1. This giveaway is only open to all Singapore Residents and ends on 22nd August 2017. </br> 2.    Winners will be announced on Novelship\'s Facebook by 26th August 2017. </br> 3.    Prizes are not transferable or exchangeable for cash. </br> 4.    All prizes which are unclaimed after one (1) month of the announcement of the winners will be forfeited. </br> 5.    Novelship\'s decision on all matters relating to the giveaway shall be final, binding and conclusive and no correspondence will be entertained. </br> 6.    The winner must agree to contribute at least one (1) social media post (write-ups, photos and/or videos) on both Novelship and their own social media channels. </br>  7.    By participating in this giveaway, you agree and consent to the terms & conditions and to Novelship using/disclosing the personal data which you submitted for various purposes, including to communicate with you for purposes related to the giveaway, to subscribe to Novelship\'s newsletter and to provide goods and services to you upon request, or in relation to which you have otherwise provided Novelship with consent. </br>  8.    Novelship reserves the right to change the terms and conditions without prior notice.';

  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
    this.api
      .fetch('me')
      .then(profile => this.user = profile);

    this.api
      .fetch('products', {filter: {'brand_id:eq': 81}, page: {number: 0, size: 6}, sort: 'id'})
      .then(products => {
        this.products = products.results;
      });
  }

  save() {
    if (!this.shoeSize) {
      this.state.errorShoeSize = true;
      return;
    } else if (!this.agreed) {
      this.state.errorTerms = true;
      return;
    }
    this.state = {};
    this.state.saving = true;
    this.api
      .edit('me', {
        meta: {
          shoe_size: this.shoeSize
        }
      })
      .then(response => {
        this.user.meta = {shoe_size: this.shoeSize};
      })
      .catch(this.errorHandler.notifyAndReport);
  }

}
