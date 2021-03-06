import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {constants} from '~/services/constants';
import {utilities} from '~/services/utilities';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class ShopRequestVM {
  request = {
    params: {
      include: ['product', 'source', 'destination', 'customer']
    }
  };
  editRequest = {};
  statuses = constants.requestStatus;

  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`me/shops/${params.shop_id}/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
        this.editRequest = (JSON.parse(JSON.stringify(response)));
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  update(fragment) {
    const updateFragment = utilities.diff(JSON.parse(JSON.stringify(this.request.data)), this.editRequest);

    this.api
      .edit(`me/shops/${this.params.shop_id}/requests/${this.params.request_id}`, updateFragment)
      .then(response => {
        Object.assign(this.request.data, updateFragment);
        notify().log('Successfully updated!');
      })
      .catch(this.errorHandler.notifyAndReport);
  }
}
