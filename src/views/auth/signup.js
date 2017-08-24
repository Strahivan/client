import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {Signup} from './signup.model';
import {Router} from 'aurelia-router';
import {ErrorReporting} from '~/services/error-reporting';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';
import {AuthService} from 'aurelia-auth';
import environment from '~/environment';

@inject(Api, AuthService, Router, NewInstance.of(ValidationController), ErrorReporting)
export class SignupView {
  signup = new Signup();
  state = {};

  constructor(api, auth, router, controller, errorReporting) {
    this.controller = controller;
    this.api = api;
    this.router = router;
    this.auth = auth;
    this.controller.addRenderer(new ValidationRenderer());
    this.errorReporting = errorReporting;
  }

  activate(params) {
    // check if the url has redirect uri and token
    if (params.token && params.redirect) {
      this.auth.auth.setToken({token: params.token}, decodeURIComponent(params.redirect));
    }
  }

  getFacebookAuthWithRedirect() {
    // servers redirect /facebook/auth
    return `https://www.facebook.com/v2.10/dialog/oauth?client_id=${environment.facebook}&redirect_uri=${environment.base}auth/facebook?state=${this.auth.auth.initialUrl || environment.app}`;
  }

  submit() {
    this.controller.validate()
    .then(result => {
      if (result.valid) {
        return this.api.create('auth/signup', { email: this.signup.email, password: this.signup.password });
      }
      throw new Error('invalid signup');
    })
    .then(response => {
      this.router.navigateToRoute('confirm');
    })
    .catch(err => {
      if (err.status === 409) {
        this.state.error = 'An account with this email already exists';
      }
      return this.errorReporting.report(new Error(err.message));
    });
  }
}
