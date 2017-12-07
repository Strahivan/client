import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {CategoryUpdateView} from '~/views/admin/category/update';
import {ErrorHandler} from '~/services/error';

@inject(Api, DialogService, ErrorHandler)
export class CategoryListView {
  categories = {
    params: {}
  }

  constructor(api, dialog, errorHandler) {
    this.api = api;
    this.dialog = dialog;
    this.errorHandler = errorHandler;
  }

  getCategories() {
    this.api
      .fetch('categories', this.categories.params)
      .then(data => this.categories.data = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  edit(category) {
    this.dialog.open({ viewModel: CategoryUpdateView, model: category })
      .whenClosed(response => {
        this.getCategories();
      });
  }

  delete(id) {
    console.log(id);
  }

  activate() {
    this.getCategories();
  }
}

