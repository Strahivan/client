import {inject, NewInstance} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {UploadService} from '~/services/upload';
import {ValidationController, ValidationRules} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';
import {UserStore} from '~/stores/user';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, UploadService, UserStore, ErrorHandler, NewInstance.of(ValidationController), Router)
export class CustomCheckout {
  state = {};
  userFragment = {};

  constructor(api, upload, userStore, errorHandler, validationController, router) {
    this.api = api;
    this.upload = upload;
    this.userStore = userStore;
    this.errorHandler = errorHandler;
    this.validationController = validationController;
    this.router = router;

    this.validationController.addRenderer(new ValidationRenderer());
  }

  getPrice() {
    this.request.total_price = this.unitPrice * this.request.count;
  }

  activate(params) {
    this.updates = {};

    this.api.fetch(`me/requests/${params.request_id}`)
      .then(request => {
        this.request = request;
        this.unitPrice = this.request.total_price * this.request.count;
        this.request.collection_method = 'courier';
      })
      .then(success => notify().log('Successfully placed order. Waiting for verification.'))
      .catch(this.errorHandler.notifyAndReport);

    this.api.fetch('me/cards')
      .then(cards => {
        if (cards.data) {
          this.cards = cards.data;
        }
      })
      .catch(err => this.errorHandler.notifyAndReport);

    setTimeout(() => {
      ValidationRules
        .ensure(user => user.phone)
        .required()
        .ensure(user => user.email)
        .email()
        .required()
        .ensure(user => user.address)
        .required()
        .on(this.userStore.user);
    }, 400);
  }

  saveProof() {
    this.request.status = 'verify';
    this.state.inflight = true;
    this.validationController.validate()
      .then(result => {
        if (result.valid) {
          this.upload.uploadImages(this.proof, 'proof')
            .then(streams => {
              this.updates.proof = streams.map(stream => stream.url.split('?')[0]);
              this.updates.status = 'verify';
              return this.api.edit(`me/requests/${this.request.id}`, this.updates);
            })
            .then(success => {
              this.state.inflight = false;
              this.router.navigateToRoute('acknowledge', {request_id: this.request.id});
            })
            .catch(this.errorHandler.notifyAndReport);
        } else {
          throw new Error('invalid request');
        }
      });
  }

  togglePaymentView(toggle) {
    this.currentPaymentMethod = this.currentPaymentMethod === toggle ? '' : toggle;
  }

  saveUser() {
  }

  saveUserInfo(prop, value) {
    this.userFragment[prop] = value;
  }

  charge(token) {
    this.state.inflight = true;
    if (Object.keys(this.userFragment).length !== 0) {
      this.api.edit('me', this.userFragment);
    }

    this.validationController.validate()
      .then(result => {
        if (result.valid) {
          (token ? this.api.create('me/cards', {token}) : Promise.resolve())
            .then(res => {
              const cardId = (res && res.card_id) || this.card;
              return this.api
                .create('me/charge', {amount: this.request.total_price, currency: 'SGD', source: cardId});
            })
            .then(response => {
              this.updates.stripe_charge_id = response.id;
              this.updates.status = 'confirmed';
              return this.api.edit(`me/requests/${this.request.id}`, this.updates);
            })
            .then(success => {
              this.state.inflight = false;
              this.router.navigateToRoute('acknowledge', {request_id: this.request.id});
            })
            .catch(error => {
              // console.log(error);
              this.state.inflight = false;
              this.errorHandler.notifyAndReport(error);
            });
        } else {
          throw new Error('invalid request');
        }
      });
  }
}
