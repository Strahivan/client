export class PromotionsRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './fila-giveaway'},
      {route: 'novelship-giveaway', name: 'fila-giveaway', auth: true, moduleId: './fila-giveaway'},
      {route: 'liveshopping', name: 'liveshopping', auth: true, moduleId: './liveshopping'}
    ]);
  }
}

