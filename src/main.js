import environment from './environment';
import {HttpClient} from 'aurelia-fetch-client';
import authConfig from './auth-config';
import 'whatwg-fetch';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-validation')
    .plugin('aurelia-animator-css')
    .plugin('aurelia-dialog', dialogConfig => dialogConfig.useDefaults())
    .plugin('aurelia-auth', baseConfig => {
      baseConfig.configure(authConfig);
    })
    .feature('resources');

  let http = new HttpClient();
  http.configure(config => {
    return config
      .useStandardConfiguration()
      .withBaseUrl(environment.base);
  });

  aurelia.container.registerInstance(HttpClient, http);

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
