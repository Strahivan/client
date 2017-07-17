import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {AuthService} from 'aurelia-auth';
import {UserStore} from '~/stores/user';

@inject(AuthService, Api, UserStore)
export class Login {
  errors = [];
  constructor(auth, api, userStore) {
    this.auth = auth;
    this.api = api;
    this.userStore = userStore;
  }

  login() {
    return this.auth.login(this.email, this.password)
      .then(response => this.api.fetch('me', {include: ['country', 'shops']}))
      .then(user => this.userStore.save(user))
      .catch(err => {
        if (err.status === 422) {
          this.errors.push('Wrong username or password');
        }
      });
  }
}
