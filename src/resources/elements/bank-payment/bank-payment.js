import {inject, bindable} from 'aurelia-framework';
import {UploadService} from '~/services/upload';
import {ErrorHandler} from '~/services/error';
import {Api} from '~/services/api';

@inject(Api, ErrorHandler, UploadService)
export class BankPayment {
  @bindable amount;
  @bindable onSuccess;

  // assumes that parent controller has state and paymentMethod properties
  constructor(api, errorHandler, upload) {
    this.api = api;
    this.upload = upload;
    this.errorHandler = errorHandler;
  }

  bind(bindingContext, overrideContext) {
    this.parent = bindingContext;
  }

  saveProof() {
    this.parent.state.inflight = true;
    return this.upload.uploadImages(this.proof, 'proof')
      .then(streams => {
        return this.onSuccess({proofUrls: streams.map(stream => stream.url.split('?')[0])});
      })
      .catch(err => {
        this.parent.state.inflight = false;
        return this.errorHandler.notifyAndReport(err);
      });
  }
}
