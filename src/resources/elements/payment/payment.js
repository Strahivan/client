import {bindable, inject} from 'aurelia-framework';
import {Api} from '~/services/api';
import environment from '~/environment';
import {ErrorReporting} from '~/services/error-reporting';

@inject(Api, ErrorReporting)
export class PaymentForm {
  @bindable save;
  @bindable buttonText;
  @bindable isDisabled;

  stripe = Stripe(environment.stripe_key);

  constructor(api, errorReporting) {
    this.api = api;
    this.errorReporting = errorReporting;
  }

  attached() {
    this.createCheckoutButton();
  }

  submit() {
    this.stripe.createToken(this.card).then(result => {
      if (result.error) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        this.errorReporting.report(result.error.message);
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
        fontSize: '1rem',
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
