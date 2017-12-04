import {inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import {HttpClient, json} from 'aurelia-fetch-client';
import {ErrorHandler} from '~/services/error';
import {UserStore} from '~/stores/user';
import {constants} from '~/services/constants';

@inject(Api, HttpClient, ErrorHandler, UserStore)
export class Acknowledge {
  constructor(api, http, errorHandler, userStore) {
    this.api = api;
    this.http = http;
    this.errorHandler = errorHandler;
    this.userStore = userStore;
  }

  updateReferralCode(requestId) {
    // TODO: Move these calls to server side
    this.http
      .fetch(`me/requests/${requestId}`)
      .then(res => res.json())
      .then(request => {
        if (request.referred_by) {
          return this.api.fetch(`users/${request.customer_id}`);
        }
        return Promise.resolve();
      })
      .then(user => {
        if (user) {
          return Promise.all([
            this.api.edit('me', {referred_by: user.id}),
            this.api.edit(`users/${user.id}`, {referral_credit: user.referral_credit + constants.referralCredit})
          ]);
        }
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  updateVirtualCredit(requestId) {
    // update virtual credit and remove the difference from the wallet
    this.http
      .fetch(`me/requests/${requestId}`)
      .then(res => res.json())
      .then(request => {
        if (request.applied_credit) {
          this.userStore.user.referral_credit = 0;
          return this.api.edit('me', {referral_credit: 0});
        }
      })
      .catch(this.errorHandler.notifyAndReport);
  }

  activate(params) {
    this.updateReferralCode(params.request_id);
    this.updateVirtualCredit(params.request_id);
    if (params.paymentId && params.PayerID) {
      this.loading = true;
      this.http
      .fetch(`integrations/paypal/execute?payer_id=${params.PayerID}&payment_id=${params.paymentId}`)
      .then(response => response.json())
      .then((approved) => {
        const updates = {
          status: 'confirmed',
          payment_method: 'paypal',
          payment_id: approved.id,
          active: true
        };

        const authorization = approved.transactions[0].related_resources[0].authorization;
        if (authorization) {
          updates.authorization_id = authorization.id;
        }

        return this.http
          .fetch(`me/requests/${params.request_id}`, {
            method: 'PUT',
            body: json(updates)
          })
          .then(res => res.json());
      })
      .then(success => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
        this.errorHandler.notifyAndReport(err, 'We were unable to complete the order. Please contact support: support@novelship.com');
      });
    }
  }
}
