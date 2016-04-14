'use strict';

(function () {
  'use strict';

  angular.module('validate-form').directive('validateLabel', validateLabel);

  function validateLabel() {
    var directive = {
      link: link,
      scope: true,
      require: ['^form', '^validateField'],
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '\n        <label ng-transclude\n               ng-class="{ \'has-error\' : hasError() }">\n        </label>\n      '
    };
    return directive;

    function link(scope, element, attrs, controllers) {
      var formCtrl = controllers[0];
      var validateFieldCtrl = controllers[1];
      var formFieldName = validateFieldCtrl.getValidateField();
      var formField = formCtrl[formFieldName];

      scope.hasError = function () {
        return formField.$invalid && (formField.$touched || formCtrl.$submitted);
      };
    }
  }
})();