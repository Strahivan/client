import {bindable, inject} from 'aurelia-framework';
import {Api} from '~/models/api';
import environment from '~/environment';

@inject(Api)
export class PaymentForm {
  @bindable save;
  @bindable buttonText;
  stripe = Stripe(environment.stripe_key);

  constructor(api) {
    this.api = api;
  }

  attached() {
    this.createCheckoutButton();
  }

  submit() {
    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        this.card.clear();
        this.save({token: result.token});
      }
    });
  }

  createCheckoutButton() {
    // Create an instance of Elements
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '1.4rem',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>
    this.card.mount(this.cardElement);
    this.card.addEventListener('change', event => {
      if (event.error) {
        console.log(event);
        this.cardErrors.textContent = event.error.message;
      } else {
        this.cardErrors.textContent = '';
      }
    });
  }
}
