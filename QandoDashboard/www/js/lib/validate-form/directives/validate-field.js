'use strict';

(function () {
  'use strict';

  angular.module('validate-form').directive('validateField', validateField);

  function validateField() {
    var directive = {
      controller: controller,
      link: link,
      scope: {
        validateField: '@'
      },
      require: ['^form', '^validateForm'],
      restrict: 'EA'
    };
    return directive;

    function controller($scope, $attrs) {
      this.getValidateField = function () {
        return $scope.validateField;
      };
    }

    function link(scope, element, attrs, controllers) {
      var formController = controllers[0];
      var validateFormController = controllers[1];
      var formField;

      scope.$watch(function () {
        formField = formController[scope.validateField];
        if (!formField) {
          return undefined;
        }
        return formField.$viewValue;
      }, function (nv, ov) {
        if (nv != ov) {
          var paramsErrors = validateFormController.getServerParamsErrors();
          var serverError = paramsErrors[scope.validateField];
          var previousValue = validateFormController.getPreviousValues()[scope.validateField];
          var showServerError = serverError && previousValue == nv;
          formField.$setValidity('remote', !showServerError);
        }
      });
    }
  }
})();