import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {utilities} from '~/services/utilities';
import {PriceService} from '~/services/price';

@inject(Api)
export class EditProductView {
  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`products/${params.product_id}`)
      .then(product => {
        this.product = product;
        this.newProduct = JSON.parse(JSON.stringify(this.product));
      })
      .catch(err => {
        console.log(err);
      });

    this.api
      .fetch('collections')
      .then(data => {
        this.collections = data.results;
      })
      .catch(err => {
        notify.log(err.message);
      });
  }

  updateCollection(collectionId) {
    this.api
      .create(`collections/${collectionId}/collectionproducts`, { product_id: this.product.id })
      .then(success => notify().log('Successfully Updated'))
      .catch(err => {
        err.json().then(res => notify().log(res.err));
      });
  }

  getPrice() {
    this.newProduct.price = PriceService.calculatePrice(this.newProduct);
  }

  edit() {
    const fragment = utilities.filterUntouchedProperties(this.product, this.newProduct);
    console.log(fragment);
    this.api
      .edit(`products/${this.params.product_id}`, fragment)
      .then(success => notify().log('Successfully Updated'))
      .catch(err => console.log(err));
  }

  swap(from, to) {
    const temp = this.newProduct.gallery.splice(from, 1, this.newProduct.gallery[to]);
    this.newProduct.gallery.splice(to, 1, temp[0]);
  }

  cancel(property) {
    this.newProduct[property] = this.product[property];
  }
}
