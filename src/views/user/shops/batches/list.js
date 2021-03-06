import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';
import {ErrorHandler} from '~/services/error';

@inject(Api, ErrorHandler)
export class BatchList {
  batches = {
    params: {
      filter: {
        'closed:eq': false
      }
    }
  };
  constructor(api, errorHandler) {
    this.api = api;
    this.errorHandler = errorHandler;
  }

  saveTrackingInfo(batch) {
    // save status on orders in batches
    this.saving = true;
    this.api
      .fetch('requests', {filter: {'batch_id:eq': batch.id }, page: {size: 100}})
      .then(requests => {
        const requestList = requests.results.map(request => this.api.edit(`requests/${request.id}`, {status: 'shipping'}));
        const requestListWithAftership = requestList.concat(this.api
          .create('integrations/aftership', {
            tracking_number: batch.temp_tracking_code,
            order_id: batch.id,
            order_id_path: `${window.location.href.split('batches')[0]}requests/list?batch_id=${batch.id}`,
            title: batch.name,
            custom_fields: {
              shop_id: this.params.shop_id
            }
          }));
        return Promise.all(requestListWithAftership);
      })
      .then(success => this.api.edit(`batches/${batch.id}`, {tracking_code: batch.temp_tracking_code}))
      .then(success => {
        batch.tracking_code = batch.temp_tracking_code;
        this.saving = false;
        notify().log('Successfully saved tracking info');
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params) {
    this.params = params;
    this.batches.params.filter['shop_id:eq'] = Number(params.shop_id);
    this.api.fetch('batches', this.batches.params)
      .then(batchesData => {
        this.batches.data = batchesData.results;
      })
      .catch(this.errorHandler.notifyAndReport);
  }

}
