import {inject} from 'aurelia-framework';
import {FetchConfig, AuthorizeStep} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {UserStore} from '~/stores/user';
import {Api} from '~/services/api';
import {ValidationRules} from 'aurelia-validation';
import {CountryStore} from '~/stores/country';
import {customRules} from '~/services/validation-rules';
import {ErrorHandler} from '~/services/error';

@inject(FetchConfig, AuthService, UserStore, CountryStore, Api, ErrorHandler)
export class App {
  constructor(fetchConfig, auth, userStore, countryStore, api, errorHandler) {
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.userStore = userStore;
    this.countryStore = countryStore;
    this.api = api;
    this.errorHandler = errorHandler;

    errorHandler.reportUnhandledErrors();
    ValidationRules.customRule(...customRules.numberRange);
  }

  activate() {
    this.fetchConfig.configure();
    this.api
      .fetch('countries')
      .then(countries => this.countryStore.countries = countries.results)
      .catch(this.errorHandler.notifyAndReport);

    if (this.auth.isAuthenticated()) {
      this.api
        .fetch('me', {include: ['country', 'shops']})
        .then(me => {
          this.userStore.user = me;
          this.errorHandler.setUserContext(me);
        })
        .catch(this.errorHandler.notifyAndReport);
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
        title: 'Login/Register'
      },
      {
        route: 'info',
        name: 'info',
        auth: false,
        nav: false,
        moduleId: 'views/info/index'
      },
      {
        route: 'brands',
        name: 'brand',
        auth: false,
        nav: false,
        moduleId: 'views/brand/index'
      },
      {
        route: 'custom-order',
        name: 'custom-order',
        auth: true,
        nav: false,
        moduleId: 'views/custom-order/index'
      },
      {
        route: 'promotions',
        name: 'promotions',
        moduleId: 'views/promotions/index'
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
    return next();
  }
}
