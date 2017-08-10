import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class ConfirmationDialog {
  constructor(dialog) {
    this.dialog = dialog;
  }

  activate(message) {
    this.message = message;
  }
}
