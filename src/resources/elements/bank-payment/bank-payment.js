import {inject, bindable} from 'aurelia-framework';
import {UploadService} from '~/services/upload';
import {ErrorReporting} from '~/services/error-reporting';
import {notify} from '~/services/notification';
import {Api} from '~/services/api';

@inject(Api, ErrorReporting, UploadService)
export class BankPayment {
  @bindable amount;
  @bindable onSuccess;

  // assumes that parent controller has state and paymentMethod properties
  constructor(api, errorReporting, upload) {
    this.api = api;
    this.upload = upload;
    this.errorReporting = errorReporting;
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
      .catch(error => {
        notify().log(err.message);
        this.parent.state.inflight = false;
        return this.errorReporting.report(new Error(err.message));
      });
  }
}
