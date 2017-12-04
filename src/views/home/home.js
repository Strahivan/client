import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class HomeView {
  countries = {};
  categories = {};
  announcements = {};
  collections = {};
  selected = {};
  brands = {};
  tags = [
    {tag: 'Play ', color: 'yellow'},
    {tag: 'Live ', color: 'red'},
    {tag: 'Wear ', color: 'white'}
  ];

  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;

    this.popular = {
      params: {
        filter: {
          'sequence:gt': 0
        },
        include: ['source'],
        sort: '-sequence',
        page: {
          size: 12,
          number: 0
        }
      }
    };
  }

  activate() {
    this.getProducts(this.popular);
    this.getCountries();
    this.getCategories();
    this.getAnnouncements();
    this.getCollections();
    this.getBrands();
  }

  getBrands() {
    this.api
      .fetch('brands', {sort: '-sequence', filter: {'sequence:notNull': true}, page: {size: 8}})
      .then(response => {
        this.brands.data = response.results;
      });
  }

  getCategories() {
    this.api
      .fetch('categories')
      .then(response => {
        this.categories.data = response.results;
      });
  }

  getCollections() {
    this.api
      .fetch('collections', {page: {size: 4, number: 0}, include: ['creator'], sort: '-sequence'})
      .then(response => {
        this.collections.data = response.results;
        this.selected.collection = response.results[0];
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getAnnouncements() {
    this.api
      .fetch('announcements', {sort: '-sequence'})
      .then(response => {
        // push the last element of the array to the beginning
        // for hero-carousel element
        response.results.unshift(response.results.pop());
        this.announcements.data = response.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getProducts(container) {
    this.api
      .fetch('products', container.params)
      .then(response => {
        container.data = response.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getCountries() {
    this.api
      .fetch('countries')
      .then(response => {
        this.countries.data = response.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}
