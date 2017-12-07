import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class AnnouncementShowView {
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.api.fetch(`announcements/${params.announcement_id}`)
      .then(data => this.announcement = data)
      .catch(this.errorHandler.notifyAndReport);
  }
}
