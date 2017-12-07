import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {CollectionUpdateView} from './update';
import {ErrorHandler} from '~/services/error';

@inject(Api, DialogService, ErrorHandler)
export class CollectionListView {
  collections = {
    params: {}
  }

  constructor(api, dialog, errorHandler) {
    this.api = api;
    this.dialog = dialog;
    this.errorHandler = errorHandler;
  }

  getCollections() {
    this.api
    .fetch('collections', this.collections.params)
    .then(data => this.collections.data = data.results)
    .catch(this.errorHandler.notifyAndReport);
  }

  edit(collection) {
    this.dialog.open({ viewModel: CollectionUpdateView, model: collection })
      .whenClosed(response => {
        this.getCollections();
      });
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCollections();
  }
}

