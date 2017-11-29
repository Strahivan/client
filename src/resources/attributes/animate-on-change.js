import {inject} from 'aurelia-framework';
import {CssAnimator} from 'aurelia-animator-css';

@inject(Element, CssAnimator)
export class AnimateOnChangeCustomAttribute {
  constructor(element, animator) {
    this.element = element;
    this.animator = animator;
  }

  valueChanged(newValue) {
    this.animator.addClass(this.element, 'fade-in').then(() => {
      setTimeout(() => {
        this.animator.removeClass(this.element, 'fade-in');
      }, 100);
    });
  }
}
