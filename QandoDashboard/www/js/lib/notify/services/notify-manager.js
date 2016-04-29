'use strict';

(function () {
  'use strict';

  angular.module('notify').factory('notifyManager', notifyManager);

  function notifyManager() {
    var svc = {};

    svc.info = function (message) {
      var html = '<i class="icon ion-chatbox-working"></i> ' + message;
      humane.log(html, { addnCls: 'humane-flatty-info' });
    };

    svc.success = function (message) {
      var html = '<i class="ion-checkmark-circled"></i> ' + message;
      humane.log(html, { addnCls: 'humane-flatty-success' });
    };

    svc.error = function (message) {
      var html = '<i class="icon ion-alert-circled"></i> ' + message;
      humane.log(html, { addnCls: 'humane-flatty-error' });
    };

    return svc;
  };
})();