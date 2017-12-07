import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {Router} from 'aurelia-router';
import {NewPassword} from './new-password.model';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, Router, NewInstance.of(ValidationController), ErrorHandler)
export class NewPasswordView {
  reset = new NewPassword();
  constructor(api, router, controller, errorHandler) {
    this.api = api;
    this.router = router;
    this.controller = controller;
    this.errorHandler = errorHandler;
    this.controller.addRenderer(new ValidationRenderer());
  }

  activate(params) {
    this.reset.token = params.token;
  }

  changePassword() {
    this.controller.validate()
      .then(result => {
        if (result.valid) {
          return this.api
            .create('auth/reset', this.reset);
        }
        throw new Error('not a valid form');
      })
      .then(response => {
        notify().log('Successfully changed password');
        return this.router.navigateToRoute('login');
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}

