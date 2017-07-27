export class Intercom {
  intercom() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic('reattach_activator');
      ic('update');
    } else {
      var d = document;
      var i = function() {
        i.c(arguments)
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args)
      };
      w.Intercom = i;

      function l() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/bszrr242';
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      }
      l();
    }
  }

  attached() {
    this.intercom();
    window.Intercom('boot', {
      app_id: 'bszrr242'
    });
  }
}

