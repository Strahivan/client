import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import {utilities} from '~/services/utilities';

@inject(Router, EventAggregator)
export class Searchbar {
  constructor(router, ea) {
    this.ea = ea;
    this.router = router;
  }

  showResults() {
    // close mobile menu if the menu is active
    utilities.closeMobileMenu();
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
