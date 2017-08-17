export class PromotionsRouter {
  configureRouter(config, router) {
    config.map([
      {route: '', name: 'all', moduleId: './fila-giveaway'},
      {route: 'fila-contest', name: 'fila-contest', auth: true, moduleId: './fila-giveaway'}
    ]);
  }
}

