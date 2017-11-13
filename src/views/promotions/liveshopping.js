import {inject} from 'aurelia-framework';
import {UserStore} from '~/stores/user';

@inject(UserStore)
export class LiveShopping {
  constructor(userStore) {
    this.quantity = 1;
    this.user = userStore.user;
  }
  attached() {
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
        this.price = (Number(this.price)).toFixed(2);
        return actions.payment.create({
          payment: {
            transactions: [
              {
                amount: { total: this.price, currency: 'SGD' }
              },
              description: this.user.id,
              item_list: {
                items: [{
                  name: this.name,
                  quantity: this.quantity
                }]
              }
            ]
          }
        });
      },

      // onAuthorize() is called when the buyer approves the payment
      onAuthorize: (data, actions) => {
        // Make a call to the REST api to execute the payment
        return actions.payment.execute().then(function() {
          window.alert('Payment Complete!');
        });
      }

    }, '#paypal-button-container');
  }
}
