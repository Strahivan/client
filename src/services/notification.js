import Humane from 'humane-js';

export function notify() {
  return Humane.create({timeout: 3500, baseCls: 'humane-flatty'});
}

export function ajaxErrorHandler(err) {
  if (err instanceof Response) {
    err.json().then((error) => notify().log(error.message))
  }
}
