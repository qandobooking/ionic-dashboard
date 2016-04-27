(function(){
  'use strict';

  angular
    .module('validate-form')
    .directive('validateForm', validateForm);

  function validateForm() {
    var directive = {
      controller,
      scope: {
        serverErrors: '='
      },
      link,
      require: '^form',
      restrict: 'EA',
    };
    return directive;

    function controller($scope, $attrs) {

      this.getServerParamsErrors = function() {
        // TODO: configure key params
        var serverErrors = $scope.serverErrors || {};
        return serverErrors.params || {};
      };

      this.getPreviousValues = function() {
        return $scope.previousValues || {};
      };
    }

    function link(scope, element, attrs, formController){
      // TODO: configure key params
      scope.$watch('serverErrors.params', function(nv) {
        scope.previousValues = _.mapValues(nv, function(v, k) {
          return formController[k].$viewValue;
        });
        _.each(_.keys(scope.previousValues), function(k) {
          formController[k].$setValidity('remote', false);
        });
      });
    }
  }
})();
