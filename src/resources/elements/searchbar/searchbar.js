import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(Router, EventAggregator)
export class Searchbar {
  constructor(router, ea) {
    this.ea = ea;
    this.router = router;
  }

  showResults() {
    // close mobile menu if the menu is active
    const menu = document.getElementsByClassName('navbar-menu')[0];
    const burger = document.getElementsByClassName('navbar-burger')[0];
    if (menu.classList.contains('is-active')) {
      menu.classList.remove('is-active');
    }
    if (burger.classList.contains('is-active')) {
      burger.classList.remove('is-active');
    }

    // if you are already in filter
    // then publish an event with query
    // the filter page will read that query, update it's parameter value
    // and refetch products
    //
    if (this.router.currentInstruction.config.name === 'filter') {
      this.ea.publish('filter__search', this.query);
      return;
    }


    this.router.navigateToRoute('filter', {search: this.query});
  }
}
