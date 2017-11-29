import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {DialogController} from 'aurelia-dialog';
import {ExternalHttp} from '~/services/external-http';
import {utilities} from '~/services/utilities';
import {ErrorHandler} from '~/services/error';

@inject(Api, DialogController, ExternalHttp, ErrorHandler)
export class AnnouncementUpdateView {
  constructor(api, controller, http, errorHandler) {
    this.api = api;
    this.http = http;
    this.controller = controller;
    this.errorHandler = errorHandler;
  }

  activate(announcement) {
    this.announcement = announcement;
    this.newAnnouncement = Object.assign({}, announcement);
  }

  update() {
    const updatedValues = utilities.filterUntouchedProperties(this.announcement, this.newAnnouncement);
    (this.image ? this.getUploadUrl(this.image[0], 'announcement') : Promise.resolve())
      .then(res => {
        if (!res) {
          return Promise.resolve();
        }
        this.newAnnouncement.image = res.signed_request.split('?')[0];
        return this.http.fetch(res.signed_request, {
          method: 'PUT',
          body: this.image[0]
        });
      })
    .then(() => {
      return this.api.edit(`announcements/${this.announcement.id}`, updatedValues);
    })
    .then(success => {
      notify().log('Successfully updated');
      this.controller.ok(Object.assign({}, this.announcement, updatedValues));
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
