import {bindable} from 'aurelia-framework';
import Hammer from 'hammerjs';

export class Carousel {
  @bindable images = [];

  activeImage = 0;

  attached() {
    this.hammer = new Hammer(this.carousel);
    this.hammer.on('swiperight', this.prev.bind(this));
    this.hammer.on('swipeleft', this.next.bind(this));
    this.imageElement = new Hammer(this.imageElem);
    this.imageElement.on('tap', this.invokeFullscreen.bind(this));
  }

  invokeFullscreen() {
    this.carousel.webkitRequestFullscreen();
  }

  next() {
    let next = this.activeImage + 1;
    if (next >= this.images.length) {
      next = 0;
    }
    this.activeImage = next;
  }

  prev() {
    let prev = this.activeImage - 1;
    if (prev < 0) {
      prev = (this.images.length - 1);
    }
    this.activeImage = prev;
  }
}
