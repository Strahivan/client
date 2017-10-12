import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UserStore} from '~/stores/user';
import environment from '~/environment';

@inject(Api, UserStore)
export class ShopCreateView {
  // first step: create shop
  // second step: stripe oauth
  tempUser = {};

  constructor(api, userStore) {
    this.api = api;
    this.userStore = userStore;
  }

  createShop() {
    ((this.tempUser.email || this.tempUser.phone) ? this.api.edit('me', {token}) : Promise.resolve())
    .then(success => this.api.create('shops', this.shop))
    .then(shop => {
      // show connect with stripe button
      // shop id in state
      this.stripeURL = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${environment.stripe_client_id}&scope=read_write&state=${shop.id}`;
      console.log(shop);
    })
    .catch(error => {
      console.log(error);
    });
  }
}
