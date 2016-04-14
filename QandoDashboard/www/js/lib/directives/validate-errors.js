'use strict';

(function () {
  'use strict';

  angular.module('validate-form').directive('validateErrors', validateErrors);

  function validateErrors() {
    var directive = {
      link: link,
      scope: true,
      require: ['^form', '^validateField', '^validateForm'],
      restrict: 'E',
      transclude: true,
      replace: true,
      templateUrl: '\n        <span>\n          <div ng-show="(formField.$touched || form.$submitted) && formField.$invalid"\n               ng-messages="formField.$error"\n               class="form-errors">\n              <span ng-transclude></span>\n          </div>\n          <div class="form-errors" ng-show="serverError()">\n            <div class="form-error">{{ serverError() }}</div>\n          </div>\n        </span>\n      '
    };
    return directive;

    function link(scope, element, attrs, controllers) {
      var formCtrl = controllers[0];
      var validateFieldCtrl = controllers[1];
      var validateFormCtrl = controllers[2];
      var fieldName = validateFieldCtrl.getValidateField();

      scope.form = formCtrl;
      scope.formField = formCtrl[fieldName];

      scope.serverError = function () {
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        var showServerError = scope.formField.$error['remote'];
        return showServerError ? serverError : null;
      };
    }
  }
})();