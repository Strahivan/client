import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {Router} from 'aurelia-router';

@inject(Api, Router)
export class Reset {
  state = {
    error: {}
  }
  constructor(api, router) {
    this.api = api;
    this.router = router;
  }

  reset() {
    this.api
    .create('auth/request-reset', {email: this.email})
    .then(success => this.router.navigateToRoute('confirm'))
    .catch(err => {
      state.error.invalidMail = err.message;
    });
  }
}
