import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {Signup} from './signup.model';
import {Router} from 'aurelia-router';
import {ErrorReporting} from '~/services/error-reporting';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';

@inject(Api, Router, NewInstance.of(ValidationController), ErrorReporting)
export class SignupView {
  signup = new Signup();
  constructor(api, router, controller, errorReporting) {
    this.controller = controller;
    this.api = api;
    this.router = router;
    this.controller.addRenderer(new ValidationRenderer());
    this.errorReporting = errorReporting;
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
    .catch(err => this.errorReporting.report(new Error(err.message)));
  }
}
