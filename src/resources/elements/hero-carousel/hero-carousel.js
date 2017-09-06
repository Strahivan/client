import {bindable} from 'aurelia-framework';
import Hammer from 'hammerjs';

export class HeroCarousel {

  @bindable gallery;
  @bindable fallback;
  currentIndex = 0;

  attached() {
    this.hammer = new Hammer(this.carousel);
    this.hammer.on('swiperight', this.prev.bind(this));
    this.hammer.on('swipeleft', this.next.bind(this));
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.gallery.length;
    this.goToSlide(true);
  }

  prev() {
    this.currentIndex = this.currentIndex === 0 ? this.gallery.length - 1 : Math.abs(this.currentIndex - 1) % this.gallery.length;
    this.goToSlide(false);
  }

  goToSlide(forward) {
    if (forward) {
      this.carousel.classList.remove('is-reversing');
    } else {
      this.carousel.classList.add('is-reversing');
    }

    const nextSet = this.gallery.slice(this.currentIndex);
    const prevSet = this.gallery.slice(0, this.currentIndex);

    nextSet.forEach((item, index) => {
      item.order = index + 1;
    });

    prevSet.reverse().forEach((item, index) => {
      item.order = this.gallery.length - index;
    });

    this.carousel.classList.remove('is-set');

    return setTimeout(() => {
      return this.carousel.classList.add('is-set');
    }, 50);
  }
}
