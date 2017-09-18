import {bindable, inject} from 'aurelia-framework';
import {UserStore} from '~/stores/user';
import {AuthService} from 'aurelia-auth';
import {Api} from '~/services/api';

@inject(UserStore, AuthService, Api)
export class Navbar {
  @bindable router;
  constructor(userStore, auth, api) {
    this.auth = auth;
    this.userStore = userStore;
    api
      .fetch('categories')
      .then(categories => {
        this.categories = categories.results;
      });
  }

  showMenu() {
    this.menuButton.classList.toggle('is-active');
    this.menu.classList.toggle('is-active');
  }

}
