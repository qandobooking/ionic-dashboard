'use strict';

(function () {
  'use strict';

  angular.module('validate-form').directive('validateErrors', validateErrors);

  function validateErrors(validateForm, $compile) {
    var directive = {
      link: link,
      scope: true,
      require: ['^form', '^validateField', '^validateForm'],
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '\n        <div>\n          <div ng-show="(formField.$touched || form.$submitted) && formField.$invalid"\n               ng-messages="formField.$error"\n               ng-class="formErrorsClass">\n              <span ng-transclude></span>\n              <div ng-if="errorsTemplateUrl">\n                <div ng-messages-include="{{errorsTemplateUrl}}">\n                </div>\n              </div>\n          </div>\n          <div ng-class="formErrorsClass" ng-if="hasServerError()">\n            <div ng-include="serverErrorsTemplateUrl">\n            </div>\n             \n          </div>\n        </div>\n      '
    };
    return directive;

    function link(scope, element, attrs, controllers) {
      var formCtrl = controllers[0];
      var validateFieldCtrl = controllers[1];
      var validateFormCtrl = controllers[2];
      var fieldName = validateFieldCtrl.getValidateField();

      scope.form = formCtrl;
      scope.formField = formCtrl[fieldName];

      scope.formErrorClass = validateForm.formErrorClass;
      scope.formErrorsClass = validateForm.formErrorsClass;
      scope.errorsTemplateUrl = validateForm.errorsTemplateUrl;
      scope.serverErrorsTemplateUrl = validateForm.serverErrorsTemplateUrl;

      scope.getServerError = function () {
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        return serverError;
      };

      scope.hasServerError = function () {
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        var showServerError = scope.formField.$error['remote'];
        return showServerError && serverError;
      };
    }
  }
})();