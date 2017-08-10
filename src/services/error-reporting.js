import Raven from 'raven-js';

export class ErrorReporting {
  constructor() {
    Raven
      .config('https://6cbc07d4e8354ef8aae5aeb24e812c1b@sentry.io/200197')
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
      Raven.captureException(evt.reason);
    };
  }

  report(err) {
    console.log(err);
    Raven.captureException(err);
  }
}
