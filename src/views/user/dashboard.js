import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {UserStore} from '~/stores/user';
import {CountryStore} from '~/stores/country';
import {AuthService} from 'aurelia-auth';
import {ErrorHandler} from '~/services/error';

@inject(Api, AuthService, ErrorHandler, UserStore, CountryStore)
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

  constructor(api, auth, errorHandler, userStore, countryStore) {
    this.api = api;
    this.auth = auth;
    this.userStore = userStore;
    this.errorHandler = errorHandler;
  }

  activate() {
    this.api
      .fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(this.errorHandler.notifyAndReport);

    this.api
      .fetch('me/shops')
      .then(shops => this.shops.data = shops.results)
      .catch(this.errorHandler.notifyAndReport);
  }
}

