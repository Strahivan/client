export class LoginRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', redirect: 'login'},
      {route: 'login', name: 'login', moduleId: './login', nav: true},
      {route: 'signup', name: 'signup', moduleId: './signup'},
      {route: 'reset', name: 'reset', moduleId: './reset'},
      {route: 'confirm', name: 'confirm', moduleId: './confirm'},
      {route: 'new-password', name: 'new-password', moduleId: './new-password'}
    ]);
  }
}
