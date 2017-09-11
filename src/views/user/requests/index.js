export class UserRequestsRouter {
  heading = 'Requests';

  configureRouter(config, router) {
    config.map([
      {route: '', name: 'userRequestList', moduleId: './list'},
      {route: ':request_id', name: 'userRequest', moduleId: './request'},
      {route: ':request_id/acknowledge', name: 'acknowledge', moduleId: './acknowledge'},
      {route: ':request_id/custom-checkout', name: 'customCheckout', moduleId: './custom-checkout'}
    ]);
  }
}

