import Humane from 'humane-js';

export function notify() {
  return Humane.create({timeout: 3500, baseCls: 'humane-flatty'});
}

