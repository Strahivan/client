import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify, ajaxErrorHandler} from '~/services/notification';
import {utilities} from '~/services/utilities';
import {PriceService} from '~/services/price';

@inject(Api, PriceService)
export class EditProductView {
  constructor(api, priceService) {
    this.api = api;
    this.priceService = priceService;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`products/${params.product_id}`, {include: ['collections']})
      .then(product => {
        this.product = product;
        this.newProduct = JSON.parse(JSON.stringify(this.product));
      })
      .catch(ajaxErrorHandler);

    this.api
      .fetch('collections')
      .then(data => {
        this.collections = data.results;
      })
      .catch(ajaxErrorHandler);
  }

  updateCollection(collectionId) {
    this.api
      .create(`collections/${collectionId}/collectionproducts`, { product_id: this.product.id })
      .then(success => notify().log('Added to new collection'))
      .catch(ajaxErrorHandler);
  }

  removeFromCollection(collectionId) {
    this.api
      .fetch(`collections/${collectionId}/collectionproducts`, {filter: {'product_id:eq': this.product.id}})
      .then(collectionproduct => this.api.remove(`collections/${collectionId}/collectionproducts/${collectionproduct.results[0].id}`))
      .then(success => {
        notify().log('Successfully removed');
        this.newProduct.collections = this.newProduct.collections.filter(collection => collection.id !== collectionId);
      })
      .catch(ajaxErrorHandler);
  }

  getPrice() {
    this.newProduct.price = this.priceService.calculatePrice(this.newProduct);
  }

  edit() {
    const fragment = utilities.filterUntouchedProperties(this.product, this.newProduct);
    this.api
      .edit(`products/${this.params.product_id}`, fragment)
      .then(success => notify().log('Successfully Updated'))
      .catch(ajaxErrorHandler);
  }

  swap(from, to) {
    const temp = this.newProduct.gallery.splice(from, 1, this.newProduct.gallery[to]);
    this.newProduct.gallery.splice(to, 1, temp[0]);
  }

  cancel(property) {
    this.newProduct[property] = this.product[property];
  }
}
