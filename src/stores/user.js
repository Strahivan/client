export class UserStore {

  get user() {
    return this._user;
  }

  set user(val) {
    this._user = val;
    const intercom = window.Intercom;
    if (typeof intercom === 'function') {
      intercom('reattach_activator');
      intercom('update', {
        email: this.userStore.user && this.userStore.user.email,
        user_id: this.userStore.user && this.userStore.user.id,
        name: this.userStore.user && this.userStore.user.name
      });
    }
  }

  clear() {
    this._user = undefined;
  }
}
