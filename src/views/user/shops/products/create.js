import {inject, NewInstance} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {UploadService} from '~/services/upload';
import {ValidationController} from 'aurelia-validation';
import {ValidationRenderer} from '~/services/validation-renderer';
import {Product} from './create.model';
import {constants} from '~/services/constants';
import animateScrollTo from 'animated-scroll-to';
import {PriceService} from '~/services/price';

@inject(Api, UploadService, PriceService, NewInstance.of(ValidationController))
export class CreateProduct {
  counter = {
    size: 0,
    color: 0,
    variation: 0
  };
  gallery = [];
  status = {};
  product = new Product();

  constructor(api, upload, priceService, controller) {
    this.controller = controller;
    this.api = api;
    this.upload = upload;
    this.priceService = priceService;
    this.controller.addRenderer(new ValidationRenderer());
  }

  activate(params) {
    this.api
      .fetch('countries')
      .then(countries => this.countries = countries.results)
      .catch(err => console.log(err));

    this.api
      .fetch('brands', {page: {size: 1000}, sort: 'name'})
      .then(brands => this.brands = brands.results)
      .catch(err => console.log(err));

    this.api
      .fetch('categories', {page: {size: 100}, sort: 'name'})
      .then(categories => this.categories = categories.results)
      .catch(err => console.log(err));

    this.product.shop_id = Number(params.shop_id);
    this.product.postage = constants.defaultPostage;
    this.product.courier = constants.defaultCourier;
  }

  attached() {
    setTimeout(this.focus.bind(this), 200);
  }

  focus() {
    this.first.focus();
  }

  reset() {
    this.focus();
    animateScrollTo(30);

    this.product = {
      shop_id: this.product.shop_id,
      source_id: this.product.source_id,
      category_id: this.product.category_id,
      brand_id: this.product.brand_id,
      postage: constants.defaultPostage,
      courier: constants.defaultCourier,
      delivery_time: this.product.delivery_time,
      local_delivery_fee: this.product.local_delivery_fee
    };

    this.gallery = null;
  }

  getPrice() {
    this.product.price = this.priceService.calculatePrice(this.product);
  }

  add(property, counter) {
    if (!this.product[property]) {
      this.product[property] = [];
    }
    this.counter[counter] = this.counter[counter] + 1;
  }

  remove(index, property, counter) {
    if (this.product[property]) {
      this.product[property].splice(index, 1);
    }

    if (this.product[property].length === 0) {
      delete this.product[property];
    }
    this.counter[counter] = this.counter[counter] - 1;
  }

  create() {
    this.controller.validate()
      .then(result => {
        if (result.valid) {
          this.status.inprogress = true;
          this.upload.uploadImages(this.gallery, 'product')
            .then(images => {
              this.product.gallery = images.map(image => image.url.split('?')[0]);
              return Promise.resolve();
            })
            .then(() => {
              if (this.product.colors && this.product.colors.some(color => color.images && color.images.length)) {
                return Promise.all(this.product.colors.map(color => {
                  if (color.images && color.images.length) {
                    return this.upload.uploadImages(color.images, 'product');
                  }
                  return Promise.resolve();
                }));
              }
            })
            .then(() => {
              if (this.product.varations && this.product.varations.some(varation => varation.images && varation.images.length)) {
                return Promise.all(this.product.varations.map(varation => {
                  if (varation.images && varation.images.length) {
                    return this.upload.uploadImages(varation.images, 'product');
                  }
                  return Promise.resolve();
                }));
              }
            })
            .then(response => {
              if (!response) {
                return Promise.resolve();
              }

              this.product.colors.forEach((color, idx) => {
                if (color.images && color.images.length) {
                  color.gallery = response[idx].map(res => res.url.split('?')[0]);
                  delete color.images;
                }
              });
              return Promise.resolve();
            })
            .then(response => this.api.create(`me/shops/${this.product.shop_id}/products`, this.product))
            .then(response => {
              this.status.inprogress = false;
              notify().log('Successfully created!');
              this.reset();
            })
            .catch(err => {
              console.log(err);
              this.status.inprogress = false;
              notify().log('Product creation failed');
            });
        } else {
          throw new Error('invalid product');
        }
      });
  }
}
