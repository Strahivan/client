import Raven from 'raven-js';
import {notify} from '~/services/notification';

export class ErrorReporting {
  constructor() {
    Raven
      .config('https://6cbc07d4e8354ef8aae5aeb24e812c1b@sentry.io/200197', { autoBreadcrumbs: { console: false }})
      .install();
  }

  setUserContext(profile) {
    Raven.setUserContext({
      email: profile.email,
      id: profile.id
    });
  }

  reportUnhandledErrors() {
    window.onunhandledrejection = function(evt) {
      console.log(evt);
      Raven.captureException(evt.type);
    };
  }

  report(err) {
    console.log(err);
    Raven.captureException(err);
  }

  notifyAndReport(err, message) {
    notify().log(message);
    this.report(err);
  }
}
