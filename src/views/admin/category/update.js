import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {DialogController} from 'aurelia-dialog';
import {ExternalHttp} from '~/services/external-http';
import {ErrorHandler} from '~/services/error';

function filterUntouchedProperties(main, updated) {
  const result = {};
  Object.keys(main).forEach(key => {
    if (main[key] !== updated[key]) {
      result[key] = updated[key];
    }
  });

  return result;
}

@inject(Api, DialogController, ExternalHttp, ErrorHandler)
export class CategoryUpdateView {
  constructor(api, controller, http, errorHandler) {
    this.api = api;
    this.http = http;
    this.controller = controller;
    this.errorHandler = errorHandler;
  }

  activate(category) {
    this.category = category;
    this.newCategory = Object.assign({}, category);
    this.api
      .fetch('categories')
      .then(data => this.categories = data.result)
      .catch(this.errorHandler.notifyAndReport);
  }

  update() {
    const updatedValues = filterUntouchedProperties(this.category, this.newCategory);
    (this.image ? this.getUploadUrl(this.image[0], 'category') : Promise.resolve())
      .then(res => {
        if (!res) {
          return Promise.resolve();
        }
        this.newCategory.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
    .then(() => {
      return this.api.edit(`categories/${this.category.id}`, updatedValues);
    })
    .then(success => {
      notify().log('Successfully updated');
      this.controller.ok(Object.assign({}, this.category, updatedValues));
    })
    .catch(err => {
      this.controller.cancel();
      return this.errorHandler.notifyAndReport(err);
    });
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}

