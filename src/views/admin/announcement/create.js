import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ExternalHttp} from '~/services/external-http';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, ExternalHttp, ErrorHandler)
export class AnnouncementCreateView {
  announcement = {};
  constructor(api, http, errorHandler) {
    //TODO: Create a model for validation
    this.api = api;
    this.http = http;
    this.errorHandler = errorHandler;
  }

  create() {
    this
      .getUploadUrl(this.image[0], 'announcement')
      .then(res => {
        this.announcement.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
      .then((res) => this.api.create('announcements', this.announcement))
      .then(success => notify().log('Successfully created!'))
      .catch(this.errorHandler.notifyAndReport);
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }
}
