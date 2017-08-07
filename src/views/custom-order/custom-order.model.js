import {ValidationRules} from 'aurelia-validation';

export class CustomOrder {
  collection_method;
  count;
  instructions;
  shop_id;
  source_id;
  status;
  url;
}

ValidationRules
  .ensure(customOrder => customOrder.url)
    .required()
  .ensure(customOrder => customOrder.source_id)
    .required()
  .ensure(customOrder => customOrder.count)
    .required()
    .satisfies((value) => value > 0)
    .withMessage('Quantity must be greater than zero')
  .ensure(customOrder => customOrder.collection_method)
    .required()
  .on(CustomOrder);

