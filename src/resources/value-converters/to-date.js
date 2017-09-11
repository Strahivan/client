import 'humanize';
import * as fecha from 'fecha';

export class ToDateValueConverter {
  toView(dateValue, format) {
    if (dateValue === null || dateValue === undefined) {
      return 'unspecified';
    }
    const date = new Date(dateValue);
    switch (format) {
    case 'human':
      return humanize.relativeTime(date.getTime() / 1000);
    case 'date':
      return fecha.format(date, 'MMMM Do, YYYY (dddd)');
    case 'datetime':
      return fecha.format(date, 'MMMM Do, YYYY (dddd)');
    default:
      return fecha.format(date, 'MMMM Do, YYYY');
    }
  }
}

