import {bindable, inject} from 'aurelia-framework';
import {UserStore} from '~/stores/user';
import {AuthService} from 'aurelia-auth';

@inject(UserStore, AuthService)
export class Navbar {
  @bindable router;
  constructor(userStore, auth) {
    this.auth = auth;
    this.userStore = userStore;
  }
}
