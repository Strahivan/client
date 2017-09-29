import {bindable, inject} from 'aurelia-framework';
import {UserStore} from '~/stores/user';
import {AuthService} from 'aurelia-auth';
import {Api} from '~/services/api';
import {Router} from 'aurelia-router';
import {utilities} from '~/services/utilities';

@inject(UserStore, AuthService, Api, Router)
export class Navbar {
  @bindable router;
  constructor(userStore, auth, api, approuter) {
    this.auth = auth;
    this.userStore = userStore;
    this.approuter = approuter;
    api
      .fetch('categories', {sort: 'id', include: ['subcategories'], filter: {'parent_id:isNull': true}})
      .then(categories => {
        this.categories = categories.results;
      });
  }

  goToRoute(route) {
    utilities.closeMobileMenu();
    this.approuter.navigate(route);
  }

  showMenu() {
    this.menuButton.classList.toggle('is-active');
    this.menu.classList.toggle('is-active');
  }

}
