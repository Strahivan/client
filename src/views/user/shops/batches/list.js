import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';

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

  async activate(params) {
    this.params = params;
    try {
      const batchesData = await this.api.fetch('batches', this.batches.params);
      this.batches.data = batchesData.results;
    } catch (e) {
      console.log(e);
    }
  }

}
