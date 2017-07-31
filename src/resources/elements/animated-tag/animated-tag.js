import {bindable} from 'aurelia-framework';

export class AnimatedTag {
  @bindable tags;
  @bindable default;

  attached() {
    this.interval();
  }

  interval() {
    let i = 0;
    this.timer = setInterval(()=> {
      const tag = document.createElement('span');
      tag.style = `color:${this.tags[i].color || inherit}`;
      tag.classList.add('animated');
      tag.classList.add('zoomIn');
      tag.id = 'animated-tag';
      tag.innerText = this.tags[i].tag;
      this.container.removeChild(document.getElementById('animated-tag'));
      this.container.appendChild(tag);
      i === 2 ? i = 0 : i++;
    }, 2500);
  }

  detached() {
    clearInterval(this.timer);
  }
}
