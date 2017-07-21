export class CustomOrderRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', moduleId: './custom-order'},
      {route: 'confirm', name: 'confirm', moduleId: './confirm-order'}
    ]);
  }
}
