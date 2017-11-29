import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UploadService} from '~/services/upload';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, UploadService, ErrorHandler)
export class CollectionCreateView {
  constructor(api, upload, errorHandler) {
    this.api = api;
    this.upload = upload;
    this.errorHandler = errorHandler;
  }

  create() {
    this.upload
      .uploadImages(this.banner, 'collection')
      .then(uploads => {
        this.collection.banner = uploads.map(file => file.url.split('?')[0])[0];
        return this.api.create('collections', this.collection);
      })
      .then(success => {
        notify().log('Successfully created!');
        this.collection = {};
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}

