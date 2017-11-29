import Raven from 'raven-js';
import {notify} from '~/services/notification';

export class ErrorHandler {
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
      if (evt.reason.json) {
        return evt.reason.json()
          .then(data => this.report(new Error(data.message)));
      }
    };
  }

  report(err) {
    return Raven.captureException(err);
  }

  notifyAndReport(err, message) {
    if (err.json) {
      return err.json().then(data => {
        notify().log(message || data.message);
        this.report(new Error(data.message));
      });
    }
    notify().log(message || err.message);
    this.report(err);
  }
}
