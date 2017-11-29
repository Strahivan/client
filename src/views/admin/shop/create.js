import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, ExternalHttp, ErrorHandler)
export class ShopCreateView {
  constructor(api, http, errorHandler) {
    //TODO: Create a model for validation
    this.api = api;
    this.http = http;
    this.errorHandler = errorHandler;
  }

  activate() {
    this.api
      .fetch('users')
      .then(data => this.users = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  create() {
    (this.image ? this.getUploadUrl(this.image[0], 'shop') : Promise.resolve())
      .then(res => {
        if (!res) {
          return Promise.resolve();
        }
        this.shop.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
      .then((res) => this.api.create('shops', this.shop))
      .then(success => {
        notify().log('Successfully created!');
        this.shop = {};
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}


