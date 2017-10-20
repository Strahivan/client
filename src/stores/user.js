export class UserStore {

  get user() {
    return this._user;
  }

  set user(val) {
    this._user = val;
    const intercom = window.Intercom;
    if (ga) {
      ga('set', 'userId', val.id);
    }
    if (typeof intercom === 'function') {
      intercom('reattach_activator');
      intercom('update', {
        email: val && val.email,
        user_id: val && val.id,
        name: val && val.name
      });
    }
  }

  clear() {
    this._user = undefined;
  }
}
