import { computedFrom } from 'aurelia-framework';

export class UserStore {

  @computedFrom('_user')
  get user() {
    return this._user;
  }

  set user(val) {
    this._user = val;
  }

  clear() {
    this._user = undefined;
  }
}
