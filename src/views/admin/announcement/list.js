import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {AnnouncementUpdateView} from '~/views/admin/announcement/update';
import {ErrorHandler} from '~/services/error';
import {notify} from '~/services/notification';

@inject(Api, DialogService, ErrorHandler)
export class AnnouncementListView {
  announcements = {
    params: {}
  }

  constructor(api, dialog, errorHandler) {
    this.api = api;
    this.dialog = dialog;
    this.errorHandler = errorHandler;
  }

  getAnnouncements() {
    this.api
      .fetch('announcements', this.announcements.params)
      .then(data => this.announcements.data = data.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  edit(announcement) {
    this.dialog.open({ viewModel: AnnouncementUpdateView, model: announcement })
      .whenClosed(response => {
        this.getAnnouncements();
      });
  }

  delete(id, index) {
    this.api
      .remove(`announcements/${id}`)
      .then(success => {
        notify().log('Successfully deleted');
        this.announcements.data[index].active = false;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate() {
    this.getAnnouncements();
  }
}
