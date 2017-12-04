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
    .plugin('aurelia-google-analytics', config => {
      config.init(environment.ga_tracking_id);
      config.attach({
        logging: {
          enabled: true
        },
        pageTracking: {
          enabled: environment.ga_tracking_enabled,
          getTitle: (payload) => {
            return document.title;
          },
          getUrl: (payload) => {
            return window.location.href;
          }
        },
        clickTracking: {
          enabled: environment.ga_tracking_enabled,
          filter: (element) => {
            return element instanceof HTMLElement &&
              (element.nodeName.toLowerCase() === 'a' ||
                element.nodeName.toLowerCase() === 'button' ||
                element.nodeName.toLowerCase() === 'span');
          }
        },
        exceptionTracking: {
          enabled: environment.ga_tracking_enabled
        }
      });
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
