export class ShopRouter {
  heading = 'Shop';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'requests'},
      { route: 'products', name: 'shopProducts', moduleId: './products/index', nav: true, title: 'Products' },
      { route: 'requests', name: 'shopRequests', moduleId: './requests/index', nav: true, title: 'Orders' },
      { route: 'batches', name: 'shopBatches', moduleId: './batches/index', nav: true, title: 'Batches' }
    ]);

    this.router = router;
  }
}

