import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';

@inject(Api, ExternalHttp)
export class BrandCreateView {
  constructor(api, http) {
    //TODO: Create a model for validation
    this.api = api;
    this.http = http;
  }

  create() {
    (this.image ? this.getUploadUrl(this.image[0], 'brand') : Promise.resolve())
      .then(res => {
        if (!res) {
          return Promise.resolve();
        }
        this.brand.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
      .then((res) => this.api.create('brands', this.brand))
      .then(success => {
        notify().log('Successfully created!');
        this.brand = {};
      })
      .catch(err => console.log(err));
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}

