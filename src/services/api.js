import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {buildQueryString} from 'aurelia-path';

@inject(HttpClient)
export class Api {
  constructor(http) {
    this.http = http;
  }

  static formatFilters(filterObj) {
    const formattedFilter = {};
    Object.keys(filterObj).forEach(key => {
      if (filterObj[key] !== null && filterObj[key] !== undefined && filterObj[key] !== '') {
        formattedFilter[`where[${key}]`] = filterObj[key];
      }
    });
    return formattedFilter;
  }

  _getQuery(path, params = {}) {
    if (params.filter) {
      params.filter['active:eq'] = params.filter['active:eq'] === false ? false : true;
    } else {
      params.filter = {'active:eq': true};
    }

    let query = path + '?';

    if (params.filter && Object.keys(params.filter).length) {
      query = `${query}${buildQueryString(Api.formatFilters(params.filter, 'where'))}`;
    }

    if (params.include && params.include.length) {
      let includeQuery = {include: `[${params.include.join(',')}]`};
      query = `${query}&${buildQueryString(includeQuery)}`;
    }

    if (params.page) {
      const number = params.page.number !== undefined ? params.page.number : 0;
      const size = params.page.size !== undefined ? params.page.size : 10;
      query = `${query}&page[number]=${number}&page[size]=${size}`;
    }

    if (params.sort) {
      query = `${query}&sort=${params.sort}`;
    }

    if (params.folder_name || params.file_name) {
      query = `${query}&folder_name=${params.folder_name}&file_name=${params.file_name}`;
    }

    return query;
  }

  fetch(path, params) {
    return this.http
      .fetch(this._getQuery(path, params))
      .then(response => response.json());
  }

  create(path, body) {
    return this.http
      .fetch(path, {
        method: 'POST',
        body: json(body)
      })
      .then(response => response.json());
  }

  edit(path, body) {
    return this.http
      .fetch(path, {
        method: 'PUT',
        body: json(body)
      })
      .then(response => response.json());
  }

  remove(path) {
    return this.http
      .fetch(path, {
        method: 'DELETE'
      })
      .then(response => response.json());
  }
}
