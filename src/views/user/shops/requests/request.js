import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {constants} from '~/services/constants';

@inject(Api)
export class ShopRequestVM {
  request = {
    params: {
      include: ['product', 'source', 'destination', 'customer']
    }
  };
  editRequest = {};
  statuses = constants.requestStatus;

  constructor(api) {
    this.api = api;
  }

  activate(params) {
    this.params = params;
    this.api
      .fetch(`me/shops/${params.shop_id}/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
        this.editRequest.status = response.status;
      })
      .catch(err => {
        console.log(err);
      });
  }

  update(fragment) {
    if (fragment.delivery_date) {
      fragment.delivery_date = (new Date(fragment.delivery_date)).toISOString();
    }
    this.api
      .edit(`me/shops/${this.params.shop_id}/requests/${this.params.request_id}`, fragment)
      .then(response => {
        Object.assign(this.request.data, fragment);
        notify().log('Successfully updated!');
      })
      .catch(err => {
        notify().log('Update failed!');
      });
  }
}
