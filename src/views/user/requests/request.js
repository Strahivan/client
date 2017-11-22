import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {DialogService} from 'aurelia-dialog';
import {ConfirmationDialog} from '~/resources/dialogs/confirmation/confirmation';
import {ErrorReporting} from '~/services/error-reporting';
import {Router} from 'aurelia-router';
import {UserStore} from '~/stores/user';
import {notify} from '~/services/notification';

@inject(Api, DialogService, ErrorReporting, Router, UserStore)
export class RequestVM {
  paymentMethod = null;
  state = {};
  request = {
    params: {
      include: ['product', 'source', 'destination', 'batch']
    }
  };

  constructor(api, dialog, errorReporting, router, userStore) {
    this.api = api;
    this.dialog = dialog;
    this.errorReporting = errorReporting;
    this.router = router;
    this.userStore = userStore;
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
    this.dialog.open({ viewModel: ConfirmationDialog, model: {message: 'Are you sure you want to cancel this order?'}})
      .whenClosed(response => {
        if (!response.wasCancelled) {
          this.request.data.status = 'rejected';
          this.api.edit(`me/requests/${this.params.request_id}`, {status: 'rejected'});
        }
      });
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

  attached() {
    window.setTimeout(() => {
      if (this.request.data.status === 'pending_payment' && this.request.data.preorder && !(this.request.data.second_installment_proof || this.request.data.second_installment)) {
        paypal.Button.render({

          env: 'production', // sandbox | production

          // PayPal Client IDs - replace with your own
          // Create a PayPal app: https://developer.paypal.com/developer/applications/create
          client: {
            sandbox: 'AVC69GGZGSjeiSnJK5REr_bVsCjHngU2eDFegfRmP3K0L_bEjuI3Ah1VbbtSg6M6IYylFMg1-QN_u4Oe',
            production: 'AQiTpqmI9uXrAZJItFue1ZSzWKl2A3HJnq_5S8qz6UBDFo58qfFdVoiAjE55qS5SLF_mI7-ZUrQmNAKS'
          },

          // Show the buyer a 'Pay Now' button in the checkout flow
          commit: true,

          // payment() is called when the button is clicked
          payment: (data, actions) => {
            // Make a call to the REST api to create the payment
            const price = (Number(this.request.data.total_price)).toFixed(2);
            return actions.payment.create({
              payment: {
                transactions: [
                  {
                    amount: { total: price, currency: 'SGD' },
                    description: this.userStore.user.id,
                    item_list: {
                      items: [{
                        name: this.request.data.product.name,
                        quantity: this.request.data.count,
                        price: price,
                        currency: 'SGD'
                      }]
                    }
                  }
                ]
              }
            });
          },

          // onAuthorize() is called when the buyer approves the payment
          onAuthorize: (data, actions) => {
            // Make a call to the REST api to execute the payment
            return actions.payment.execute().then(() => {
              notify().log('Success!');
              this.request.data.status = 'shipping';
              this.api.edit(`me/requests/${this.params.request_id}`, {status: 'ready_for_delivery', second_installment: data.paymentID});
            });
          }
        }, '#secondpayment-paypal-button');
      }
    }, 3000);
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
