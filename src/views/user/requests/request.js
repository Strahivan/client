import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {ConfirmationDialog} from '~/resources/dialogs/confirmation/confirmation';
import {ErrorReporting} from '~/services/error-reporting';
import {Router} from 'aurelia-router';

@inject(Api, DialogService, ErrorReporting, Router)
export class RequestVM {
  paymentMethod = null;
  state = {};
  request = {
    params: {
      include: ['product', 'source', 'destination']
    }
  };

  constructor(api, dialog, errorReporting, router) {
    this.api = api;
    this.dialog = dialog;
    this.errorReporting = errorReporting;
    this.router = router;
  }

  currentStatus(status) {
    const statusMap = {
      pending: 'Checking and Quoting',
      verify: 'Verifying Receipt',
      confirmed: 'Confirmed',
      approval: 'Waiting for your Approval'
    };

    return statusMap[status];
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

  updateOrder(stripeChargeId) {
    this.api
      .edit(`me/requests/${this.request.data.id}`, {status: 'ready_for_delivery', second_installment: stripeChargeId})
      .then(success => {
        this.state.inflight = false;
        this.state.showSuccess = true;
      })
      .catch(error => console.log(error));
  }

  updateOrderWithBankPayment(proofUrls) {
    this.api
      .edit(`me/requests/${this.request.data.id}`, {status: 'verify_pending_payment', second_installment_proof: proofUrls})
      .then(success => {
        this.state.inflight = false;
        this.state.showBankPaymentSuccess = true;
      })
      .catch(error => console.log(error));
  }

  activate(params) {
    this.params = params;
    this.api.fetch(`me/requests/${params.request_id}`, this.request.params)
      .then(response => {
        this.request.data = response;
      })
      .catch(err => this.errorReporting.report(new Error(err.message)));
  }
}
