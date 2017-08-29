import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UserStore} from '~/stores/user';
import {Payment} from '~/services/payment';
import {ExternalHttp} from '~/services/external-http';

@inject(Api, UserStore, Payment, ExternalHttp)
export class ProfileEdit {
  countries = {};
  state = {};

  constructor(api, userStore, payment, http) {
    this.api = api;
    this.payment = payment;
    this.userStore = userStore;
    this.http = http;
  }

  activate() {
    this.api
      .fetch('countries')
      .then(countries => this.countries.data = countries.results)
      .catch(err => this.countries.error = err);

    this.payment
      .getCards()
      .then(cards => this.cards = cards.data)
      .catch(err => console.log(err));
  }

  userUpdate(fragment) {
    return this.api
      .edit('me', fragment)
      .then(success =>this.userStore.user = Object.assign(this.userStore.user, fragment))
      .catch(err => console.log(err));
  }

  removeCard(cardId) {
    this.payment.deleteCard(cardId)
      .then(() => this.payment.getCards())
      .then(cards => this.cards = cards.data)
      .catch(err => console.log(err));
  }

  save(token) {
    this.state.inflight = true;
    this.payment.saveCard(token)
      .then(response => {
        this.state.inflight = false;
        return this.payment.getCards();
      })
      .then(cards => {
        this.cards = cards.data;
        this.state.inflight = false;
      })
      .catch(error => {
        this.state.inflight = false;
        // send error to admin
        console.log(error);
      });
  }

  upload() {
    let avatarUrl;
    this.getUploadUrl(this.avatar[0], 'avatar')
      .then((response) => {
        avatarUrl = response.signed_request.split('?')[0];
        return this.http.fetch(response.signed_request, {
          method: 'PUT',
          body: this.avatar[0]
        });
      })
      .then(success => this.userUpdate({avatar: avatarUrl}))
      .catch(err => console.log(err));
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }

}
