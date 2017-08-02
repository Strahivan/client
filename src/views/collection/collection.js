import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {PriceService} from '~/services/price';

@inject(Api)
export class CollectionView {
  collectionproducts = {};
  collection = {
    page: {
      size: 20
    }
  };

  constructor(api) {
    this.api = api;
  }

  activate(param) {
    this.api
      .fetch(`collections/${param.collection_id}`)
      .then(collection => this.collection.data = collection)
      .catch(err => this.collection.error = err);

    this.api
      .fetch(`collections/${param.collection_id}/collectionproducts`, {include: ['product', 'product.source'], page: {size: 24}})
      .then(response => {
        this.collectionproducts.data = response.results.map(cp => {
          cp.product.price = PriceService.calculatePrice(cp.product);
          return cp;
        });
      })
      .catch(err => console.log(err));
  }
}
