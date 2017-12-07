import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {utilities} from '~/services/utilities';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class EditProductView {
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`products/${params.product_id}`, {include: ['collections']})
      .then(product => {
        this.product = product;
        this.newProduct = JSON.parse(JSON.stringify(this.product));
      })
      .catch(this.errorHandler.notifyAndReport);

    this.api
      .fetch('collections')
      .then(data => {
        this.collections = data.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  updateCollection(collectionId) {
    this.api
      .create(`collections/${collectionId}/collectionproducts`, { product_id: this.product.id })
      .then(success => notify().log('Added to new collection'))
      .catch(this.errorHandler.notifyAndReport);
  }

  removeFromCollection(collectionId) {
    this.api
      .fetch(`collections/${collectionId}/collectionproducts`, {filter: {'product_id:eq': this.product.id}})
      .then(collectionproduct => this.api.remove(`collections/${collectionId}/collectionproducts/${collectionproduct.results[0].id}`))
      .then(success => {
        notify().log('Successfully removed');
        this.newProduct.collections = this.newProduct.collections.filter(collection => collection.id !== collectionId);
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  edit() {
    const fragment = utilities.filterUntouchedProperties(this.product, this.newProduct);
    this.api
      .edit(`products/${this.params.product_id}`, fragment)
      .then(success => notify().log('Successfully Updated'))
      .catch(this.errorHandler.notifyAndReport);
  }

  swap(from, to) {
    const temp = this.newProduct.gallery.splice(from, 1, this.newProduct.gallery[to]);
    this.newProduct.gallery.splice(to, 1, temp[0]);
  }

  cancel(property) {
    this.newProduct[property] = this.product[property];
  }
}
