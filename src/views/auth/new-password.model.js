import {ValidationRules} from 'aurelia-validation';

export class NewPassword {
  password;
  repeat;
}

ValidationRules
  .ensure(signup => signup.password)
    .required()
  .ensure(signup => signup.repeat)
    .required()
    .satisfies((repeat, form) => repeat === form.password)
    .withMessage('Passwords do not match')
  .on(NewPassword);

