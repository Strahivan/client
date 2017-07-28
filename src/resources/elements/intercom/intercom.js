import {inject} from 'aurelia-framework';
import {UserStore} from '~/stores/user';

@inject(UserStore)
export class Intercom {

  constructor(user) {
    this.user = user.user;
  }

  intercom() {
    const win = window;
    const intercom = win.Intercom;
    if (typeof intercom === 'function') {
      intercom('reattach_activator');
      intercom('update', {
        email: this.user && this.user.email,
        user_id: this.user && this.user.id,
        name: this.user && this.user.name
      });
    } else {
      const doc = document;
      const i = function() {
        i.c(arguments)
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      win.Intercom = i;

      const tag = doc.createElement('script');
      tag.type = 'text/javascript';
      tag.async = true;
      tag.src = 'https://widget.intercom.io/widget/bszrr242';
      const firstScriptTag = doc.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  attached() {
    this.intercom();
    window.Intercom('boot', {
      app_id: 'bszrr242',
      email: this.user && this.user.email,
      user_id: this.user && this.user.id,
      name: this.user && this.user.name
    });
  }
}

