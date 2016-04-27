'use strict';

(function () {
  'use strict';

  angular.module('initial-loader').directive('initialLoader', initialLoader);

  function initialLoader(initialLoaderManager) {

    var directive = {
      controller: controller

    };
    function controller($scope, $element, $attrs) {
      var _this = this;

      console.log("initial loader directive");

      if (!$attrs.initialLoader) {
        console.error("pass in a key!!!");
        return;
      }

      $scope.$on('$destroy', function () {
        initialLoaderManager.unregister($attrs.initialLoader, _this);
      });

      this.hi = function () {
        alert('hi');
      };

      initialLoaderManager.register($attrs.initialLoader, this);
    }

    return directive;
  };
})();