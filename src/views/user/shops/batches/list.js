import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {notify} from '~/services/notification';

@inject(Api)
export class BatchList {
  batches = {
    params: {
      filter: {
        'closed:eq': false
      }
    }
  };
  constructor(api) {
    this.api = api;
  }

  async saveTrackingInfo(batch) {
    // save status on orders in batches
    try {
      this.saving = true;
      const requests = (await this.api.fetch('requests', {filter: {'batch_id:eq': batch.id }, page: {size: 100}})).results;
      requests.forEach(async (request) => {
        await this.api.edit(`requests/${request.id}`, {status: 'shipping'});
      });
      // create aftership tracking
      await this.api.create('integrations/aftership', {tracking_number: batch.temp_tracking_code, order_id: batch.id, title: batch.name});
      await this.api.edit(`batches/${batch.id}`, {tracking_code: batch.temp_tracking_code});
      batch.tracking_code = batch.temp_tracking_code;
      this.saving = false;
      notify().log('Successfully saved tracking info');
    } catch (e) {
      this.saving = false;
      console.log(e);
    }
  }

  async activate(params) {
    this.params = params;
    this.batches.params.filter['shop_id:eq'] = Number(params.shop_id);
    try {
      const batchesData = await this.api.fetch('batches', this.batches.params);
      this.batches.data = batchesData.results;
    } catch (e) {
      console.log(e);
    }
  }

}
