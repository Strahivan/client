import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {constants} from '~/services/constants';
import {UserStore} from '~/stores/user';
import {CountryStore} from '~/stores/country';
import {AuthService} from 'aurelia-auth';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, AuthService, ErrorReporting, UserStore, CountryStore)
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

  constructor(api, auth, errorReporting, userStore, countryStore) {
    this.api = api;
    this.auth = auth;
    this.userStore = userStore;
    this.errorReporting = errorReporting;
  }

  activate() {
    this.api
      .fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => this.errorReporting.report(new Error(err.message)));

    this.api
      .fetch('me/shops')
      .then(shops => this.shops.data = shops.results)
      .catch(err => this.errorReporting.report(new Error(err.message)));
  }
}

