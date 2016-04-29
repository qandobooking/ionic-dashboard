(function() {
  'use strict';

  angular.module('notify')
  .factory('notifyManager', notifyManager);

  function notifyManager() {
    var svc = {};

    svc.info = (message) => {
      const html = `<i class="icon ion-chatbox-working"></i> ${message}`;
      humane.log(html, { addnCls: 'humane-flatty-info' });
    };

    svc.success = (message) => {
      const html = `<i class="ion-checkmark-circled"></i> ${message}`;
      humane.log(html, { addnCls: 'humane-flatty-success' });
    };

    svc.error = (message) => {
      const html = `<i class="icon ion-alert-circled"></i> ${message}`;
      humane.log(html, { addnCls: 'humane-flatty-error' });
    };

    return svc;
  };

})();
