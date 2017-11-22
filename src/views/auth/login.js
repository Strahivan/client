import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {AuthService} from 'aurelia-auth';
import {UserStore} from '~/stores/user';
import {ErrorReporting} from '~/services/error-reporting';
import environment from '~/environment';

@inject(AuthService, Api, UserStore, ErrorReporting)
export class Login {
  constructor(auth, api, userStore, errorReporting) {
    this.auth = auth;
    this.api = api;
    this.userStore = userStore;
    this.errorReporting = errorReporting;
    this.state = {
      error: {}
    };
  }

  getFacebookAuthWithRedirect() {
    // servers redirect /facebook/auth
    return `https://www.facebook.com/v2.10/dialog/oauth?client_id=${environment.facebook}&scope=email&redirect_uri=${environment.base}auth/facebook?state=${this.auth.auth.initialUrl || environment.app}`;
  }

  login() {
    this.state.error.wrongLogin = null;
    let password = document.getElementById('password').value;
    if (this.password !== password) {
      this.password = password;
    }
    let email = document.getElementById('email').value;
    if (this.email !== email) {
      this.email = email;
    }
    return this.auth.login(this.email, this.password)
      .then(response => this.api.fetch('me', {include: ['country', 'shops']}))
      .then(user => this.userStore.user = user)
      .catch(err => {
        if (err.status === 422) {
          this.state.error.wrongLogin = 'Wrong username or password';
          return;
        }
        this.errorReporting.report(new Error(err.message));
      });
  }
}
