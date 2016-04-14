(function(){
  'use strict';

  angular
    .module('validate-form')
    .directive('validateErrors', validateErrors);

  function validateErrors($sce) {
    var directive = {
      link,
      scope: true,
      require: ['^form', '^validateField', '^validateForm'],
      restrict: 'E',
      transclude: true,
      replace: true,
      template: `
        <span>
          <div ng-show="(formField.$touched || form.$submitted) && formField.$invalid"
               ng-messages="formField.$error"
               class="form-errors">
              <span ng-transclude></span>
          </div>
          <div class="form-errors" ng-show="serverError()">
            <div class="form-error">{{ serverError() }}</div>
          </div>
        </span>
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

      scope.serverError = function() {
        var paramsErrors = validateFormCtrl.getServerParamsErrors();
        var serverError = paramsErrors[fieldName];
        if (_.isArray(serverError)) {
          //serverError = $compile('<h1>yeah!</h1>');
          //serverError = $sce.trustAsHtml('<h1>Yeah!</h1>');
          //serverError = _.map(serverError, error => (
            //`<p>${error}</p>`
          //));
          //console.log(serverError);
        }
        var showServerError = scope.formField.$error['remote'];
        return showServerError ? serverError : null;
      };
    }
  }
})();
