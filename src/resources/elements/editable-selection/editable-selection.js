import {bindable, computedFrom} from 'aurelia-framework';

export class EditableSelection {
  @bindable choices;
  @bindable update;
  @bindable selection;
  @bindable key;

  attached() {
    this.tempSelection = this.selection;
  }

  @computedFrom('choices')
  get displayValue() {
    if (this.choices) {
      return this.choices.find(choice => choice.id === this.selection);
    }
  }

  showSelectionBox() {
    this.edit = true;
  }

  execute() {
    this.edit = false;
    this.selection = this.tempSelection;
    this.update({fragment: {[this.key]: this.selection}});
  }

  cancel() {
    this.tempSelection = this.selection;
    this.edit = false;
  }
}
