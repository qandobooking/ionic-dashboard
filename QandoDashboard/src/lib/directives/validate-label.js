(function(){
  'use strict';

  angular
    .module('validate-form')
    .directive('validateLabel', validateLabel);

  function validateLabel(validateForm) {
    var directive = {
      link,
      scope: true,
      require: ['^form', '^validateField'],
      restrict: 'E',
      transclude: true,
      replace: true,
      template: function(tElement, attrs){
        return attrs.labelAsDiv !== undefined ?
        `
        <div ng-transclude
               ng-class="errorClass()">
        </div>
        ` : 
        `
        <label ng-transclude
               ng-class="errorClass()">
        </label>
        `
      }
    };
    return directive;

    function link(scope, element, attrs, controllers) {
      var formCtrl = controllers[0];
      var validateFieldCtrl = controllers[1];
      var formFieldName = validateFieldCtrl.getValidateField();
      var formField =formCtrl[formFieldName]

      scope.errorClass = function() {
        return (formField.$invalid &&
               (formField.$touched || formCtrl.$submitted)) ? validateForm.labelErrorClass : '';
      };
    }
  }
})();
