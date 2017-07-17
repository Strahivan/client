export class UserStore {
  get user() {
    return this._user;
  }

  save(user) {
    // publish an event
    this._user = user;
  }

  clear() {
    // publish another event
    this._user = undefined;
  }
}
