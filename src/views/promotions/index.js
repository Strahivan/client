export class PromotionsRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './fila-giveaway'},
      {route: 'fila-giveaway', name: 'fila-giveaway', auth: true, moduleId: './fila-giveaway'}
    ]);
  }
}

