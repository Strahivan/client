export class UserStore {

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
