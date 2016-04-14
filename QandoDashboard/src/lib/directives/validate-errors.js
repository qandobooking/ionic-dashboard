(function(){
  'use strict';

  angular
    .module('validate-form')
    .directive('validateErrors', validateErrors);

  function validateErrors(validateForm, $compile) {
    var directive = {
      link,
      scope: true,
      require: ['^form', '^validateField', '^validateForm'],
      restrict: 'E',
      transclude: true,
      replace: true,
      template: `
        <div>
          <div ng-show="(formField.$touched || form.$submitted) && formField.$invalid"
               ng-messages="formField.$error"
               ng-class="formErrorsClass">
              <span ng-transclude></span>
              <div ng-if="errorsTemplateUrl">
                <div ng-messages-include="{{errorsTemplateUrl}}">
                </div>
              </div>
          </div>
          <div ng-class="formErrorsClass" ng-if="hasServerError()">
            <div ng-include="serverErrorsTemplateUrl">
            </div>
             
          </div>
        </div>
      `
    };
    return directive;

    function link(scope, element, attrs, controllers) {
      var formCtrl = controllers[0];
      var validateFieldCtrl = controllers[1];
      var validateFormCtrl = controllers[2];
      var fieldName = validateFieldCtrl.getValidateField()

      scope.form = formCtrl;
      scope.formField = formCtrl[fieldName];

      scope.formErrorClass = validateForm.formErrorClass;
      scope.formErrorsClass = validateForm.formErrorsClass;
      scope.errorsTemplateUrl = validateForm.errorsTemplateUrl;
      scope.serverErrorsTemplateUrl = validateForm.serverErrorsTemplateUrl;

      
      scope.getServerError = function(){
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        return serverError;

      }

      scope.hasServerError = function(){
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        var showServerError = scope.formField.$error['remote'];
        return showServerError && serverError;
      }

      


      
    }
  }
})();
