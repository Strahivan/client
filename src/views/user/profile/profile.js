import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {UserStore} from '~/stores/user';
import {ExternalHttp} from '~/services/external-http';
import {ErrorHandler} from '~/services/error';

@inject(Api, UserStore, ExternalHttp, ErrorHandler)
export class ProfileEdit {
  countries = {};
  state = {};

  constructor(api, userStore, http, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
    this.userStore = userStore;
    this.http = http;
  }

  activate() {
    this.api
      .fetch('countries')
      .then(countries => this.countries.data = countries.results)
      .catch(this.errorHandler.notifyAndReport);
  }

  userUpdate(fragment) {
    return this.api
      .edit('me', fragment)
      .then(success =>this.userStore.user = Object.assign(this.userStore.user, fragment))
      .catch(this.errorHandler.notifyAndReport);
  }

  upload() {
    let avatarUrl;
    this.getUploadUrl(this.avatar[0], 'avatar')
      .then((response) => {
        avatarUrl = response.signed_request.split('?')[0];
        return this.http.fetch(response.signed_request, {
          method: 'PUT',
          body: this.avatar[0]
        });
      })
      .then(success => this.userUpdate({avatar: avatarUrl}))
      .catch(this.errorHandler.notifyAndReport);
  }

  getUploadUrl(file, type) {
    return this.api
      .fetch('upload', {file_name: file.name, folder_name: type, file_type: file.type});
  }

}
