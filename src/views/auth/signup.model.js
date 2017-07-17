import {ValidationRules} from 'aurelia-validation';

export class Signup {
  email;
  password;
  repeat;
}

ValidationRules
  .ensure(signup => signup.email)
    .required()
    .email()
  .ensure(signup => signup.password)
    .required()
  .ensure(signup => signup.repeat)
    .required()
    .satisfies((repeat, form) => repeat === form.password)
    .withMessage('Passwords do not match')
  .on(Signup);

