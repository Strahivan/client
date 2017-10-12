export class UserRouter {
  heading = 'User';

  configureRouter(config, router) {
    config.map([
      {route: '', redirect: 'dashboard'},
      {route: 'dashboard', name: 'dashboard', title: 'Dashboard', nav: true, moduleId: './dashboard'},
      {route: 'profile', name: 'profile', title: 'Edit Profile', nav: true, moduleId: './profile/profile'},
      {route: 'trips', name: '', moduleId: './trips/index'},
      {route: 'requests', moduleId: './requests/index'},
      {route: 'shops/create', moduleId: './shops/create/create'},
      {route: 'shops/:shop_id', moduleId: './shops/index'}
    ]);

    this.router = router;
  }
}

