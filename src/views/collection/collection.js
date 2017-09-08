import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {activationStrategy} from 'aurelia-router';
import {OpenGraphMetadataService} from '~/services/open-graph';

@inject(Api)
export class CollectionView {
  collectionproducts = {
    params: {
      page: {
        size: 24
      },
      include: ['product', 'product.source']
    }
  };
  collection = {
    page: {
      size: 20,
      number: 0
    }
  };

  constructor(api) {
    this.api = api;
  }

  determineActivationStrategy() {
    return activationStrategy.replace;
  }

  activate(param, config, instruction) {
    this.query = Object.assign({}, instruction.queryParams);
    this.params = param;

    this.collectionproducts.params.page.number = param.page && Number(param.page) || 0;
    this.query.page = this.query.page && Number(this.query.page) || 0;

    this.api
      .fetch(`collections/${param.collection_id}`)
      .then(collection => {
        OpenGraphMetadataService.setMeta([
          {
            property: 'og:title',
            content: collection.name
          },
          {
            property: 'og:image',
            content: collection.picture
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:description',
            content: collection.description
          },
          {
            property: 'og:url',
            content: window.location.href
          }
        ]);

        this.collection.data = collection;
      })
      .catch(err => console.log(err));

    this.api
      .fetch(`collections/${param.collection_id}/collectionproducts`, this.collectionproducts.params)
      .then(response => {
        this.collectionproducts.total = response.total;
        this.collectionproducts.data = response.results;
      })
      .catch(err => console.log(err));
  }
}
