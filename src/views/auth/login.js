import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {AuthService} from 'aurelia-auth';
import {UserStore} from '~/stores/user';
import {ErrorReporting} from '~/services/error-reporting';

@inject(AuthService, Api, UserStore, ErrorReporting)
export class Login {
  errors = [];
  constructor(auth, api, userStore, errorReporting) {
    this.auth = auth;
    this.api = api;
    this.userStore = userStore;
    this.errorReporting = errorReporting;
    this.state = {
      error: {}
    };
  }

  authenticate(name) {
    return this.auth.authenticate(name, false, null)
      .then((response)=>{
        console.log(response);
      });
  }

  login() {
    this.state.error.wrongLogin = null;
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
