import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {CustomCheckoutDialog} from './custom-checkout';
import {ConfirmationDialog} from '~/resources/dialogs/confirmation/confirmation';

@inject(Api, DialogService)
export class RequestVM {
  request = {
    params: {
      include: ['product', 'source', 'destination']
    }
  };

  constructor(api, dialog) {
    this.api = api;
    this.dialog = dialog;
  }

  confirm() {
    this.dialog.open({ viewModel: CustomCheckoutDialog, model: this.request.data })
      .whenClosed(response => {

      });
  }

  reject() {
    this.dialog.open({ viewModel: ConfirmationDialog, model: {message: ', cancel order'}})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.request.data.status = 'rejected';
          this.api.edit(`me/requests/${this.params.request_id}`, {status: 'rejected'});
        }
      });
  }

  activate(params) {
    this.params = params;
    this.api.fetch(`me/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
