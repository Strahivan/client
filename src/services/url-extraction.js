import {inject} from 'aurelia-framework';
import {ExternalHttp} from '~/services/external-http';
import environment from '~/environment';

@inject(ExternalHttp)
export class UrlExtraction {
  constructor(http) {
    this.http = http;
  }

  getUrlData(url) {
    return this.http
      .fetch(`https://iframe.ly/api/iframely?url=${url}&api_key=${environment.iframely_token}`)
      .then(res => res.json());
  }
}
