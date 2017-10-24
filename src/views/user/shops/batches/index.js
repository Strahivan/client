export class BatchRouter {
  heading = 'Batch';

  configureRouter(config, router) {
    config.map([
      { route: '', redirect: 'list' },
      { route: 'list', name: 'batchList', moduleId: './list', title: 'List' },
      { route: 'create', name: 'batchCreate', moduleId: './create' },
      { route: ':batch_id', name: 'batchView', moduleId: './batch' }
    ]);
  }
}

