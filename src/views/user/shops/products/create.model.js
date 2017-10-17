import {ValidationRules} from 'aurelia-validation';

export class Product {
  brand_id;
  category_id;
  colors;
  cost;
  courier;
  currency;
  delivery_time;
  delta;
  description;
  dimensions;
  featured;
  gallery;
  local_delivery_fee;
  name;
  sequence;
  platform_charge;
  postage;
  price;
  preorder;
  sizes;
  source_id;
  url;
  variations;
  weight;
}

ValidationRules
  .ensure(product => product.category_id)
    .required()
  .ensure(product => product.name)
    .required()
  .ensure(product => product.gallery)
    .required()
  .ensure(product => product.brand_id)
    .required()
  .ensure(product => product.price)
    .required()
    .satisfiesRule('numberRange', 1, 10000)
  .ensure(product => product.source_id)
    .required()
  .ensure(product => product.delivery_time)
    .displayName('Delivery time')
    .required()
  .ensure(product => product.description)
    .minLength(100)
    .required()
  .ensure(product => product.currency)
    .required()
  .on(Product);

