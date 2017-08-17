export class Hotjar {

  attached() {
    window.hj = window.hj || function() { (window.hj.q = window.hj.q || []).push(arguments); };
    window._hjSettings = { hjid: 595766, hjsv: 5 };
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.async = 1;
    script.src = '//static.hotjar.com/c/hotjar-' + window._hjSettings.hjid + '.js?sv=' + window._hjSettings.hjsv;
    head.appendChild(script);
  }
}
