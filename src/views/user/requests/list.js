import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, ErrorReporting)
export class RequestListVM {
  requests = {
    params: {
      include: ['product']
    }
  }
  constructor(api, errorReporting) {
    this.api = api;
    this.errorReporting = errorReporting;
  }

  activate(params) {
    this.api.fetch('me/requests', this.requests.params)
      .then(requests => this.requests.data = requests.results)
      .catch(err => errorReporting.report(new Error(err.message)));
  }
}
