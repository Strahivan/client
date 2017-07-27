import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {UserStore} from '~/stores/user';
import {AuthService} from 'aurelia-auth';

@inject(Api, Router, UserStore, AuthService)
export class DashboardView {
  requests = {
    params: {
      include: ['product'],
      sort: '-updated_at'
    },
    page: {
      size: 100
    },
    statuses: constants.requestStatus
  };
  shops = {};

  constructor(api, router, userStore, auth) {
    this.api = api;
    this.router = router;
    this.user = userStore.user;
    this.auth = auth;
  }

  activate() {
    this.api
      .fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => this.requests.error = err);

    this.api
      .fetch('me/shops')
      .then(shops => this.shops.data = shops.results)
      .catch(err => this.shops.error = err);
  }

  getRequests() {
    setTimeout(() => {
      this.api
        .fetch('me/requests', this.requests.params)
        .then(requests => this.requests.data = requests.results)
        .catch(err => this.requests.error = err);
    });
    /* required for event propagation */
    return true;
  }

  confirmDelivery(request) {
    this.api
      .edit(`me/requests/${request.id}`, {status: 'completed'})
      .then(() => request.status = 'completed')
      .catch(err => this.requests.error = err);
  }
}

