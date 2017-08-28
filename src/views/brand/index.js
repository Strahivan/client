export class CollectionRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './list'},
      {route: ':brand_id', name: 'brand', moduleId: './brand'}
    ]);
  }
}

