(function(){
  'use strict';

  angular
    .module('app')
    .directive('inputTime', inputTime);

  function isAnEmptyValue(value) {
    return angular.isUndefined(value) || value === null || value === '';
  }

  function inputTime() {
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {

          //For model -> DOM validation
          ngModel.$formatters.unshift(function(value) {
            var m = moment(new Date(value));

            if (m.isValid()) {
              return m.format('HH:mm:ss');
            } else if (isAnEmptyValue(value)) {
              return null;
            } else {
              return undefined;
            }
          });
      }
   };

  }
})();
