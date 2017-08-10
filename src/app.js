import {inject} from 'aurelia-framework';
import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {UserStore} from '~/stores/user';
import {Api} from '~/services/api';
import {ValidationRules} from 'aurelia-validation';
import {CountryStore} from '~/stores/country';
import {customRules} from '~/services/validation-rules';
import {ErrorReporting} from '~/services/error-reporting';

@inject(FetchConfig, AuthService, UserStore, Api, ErrorReporting)
export class App {
  constructor(fetchConfig, auth, userStore, api, errorReporting) {
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.userStore = userStore;
    this.api = api;
    this.errorReporting = errorReporting;

    errorReporting.reportUnhandledErrors();
    ValidationRules.customRule(...customRules.numberRange);
  }

  async activate() {
    this.fetchConfig.configure();

    CountryStore.countries = (await this.api.fetch('countries')).results;

    if (this.auth.isAuthenticated()) {
      this.api
        .fetch('me', {include: ['country', 'shops']})
        .then(profile => {
          this.userStore.user = profile;
          this.errorReporting.setUserContext(profile);
        })
        .catch(err => this.errorReporting.report(err.message));
    }
  }

  configureRouter(config, router) {
    config.title = 'Novelship';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      {
        route: '',
        redirect: 'home'
      },
      {
        route: 'home',
        name: 'home',
        moduleId: 'views/home/index',
        title: 'Home'
      },
      {
        route: 'collections',
        name: 'collections',
        moduleId: 'views/collection/index',
        title: 'Collections'
      },
      {
        route: 'products/:product_id',
        name: 'product',
        moduleId: 'views/product/index'
      },
      {
        route: 'filter',
        name: 'filter',
        moduleId: 'views/filter/index'
      },
      {
        route: 'admin',
        name: 'admin',
        moduleId: 'views/admin/index',
        title: 'Admin'
      },
      {
        route: 'user',
        name: 'user',
        moduleId: 'views/user/index',
        nav: true,
        auth: true,
        title: 'Account'
      },
      {
        route: 'auth',
        name: 'auth',
        auth: false,
        nav: true,
        moduleId: 'views/auth/index',
        title: 'Login'
      },
      {
        route: 'info',
        name: 'info',
        auth: false,
        nav: false,
        moduleId: 'views/info/index'
      },
      {
        route: 'custom-order',
        name: 'custom-order',
        auth: true,
        nav: false,
        moduleId: 'views/custom-order/index'
      }
    ]);

    this.router = router;
  }
}

class PostCompleteStep {
  run(instruction, next) {
    if (!instruction.config.settings.noScrollToTop) {
      window.scrollTo(0, 0);
    }
    // window.Intercom('update');
    return next();
  }
}
