(function() {
  'use strict';

  angular.module('initial-loader')
  .directive('initialLoader', initialLoader);

  function initialLoader(initialLoaderManager){

    var directive  = {
      controller


    }
    function controller($scope, $element, $attrs){
      console.log("initial loader directive")

      if(!$attrs.initialLoader){
        console.error("pass in a key!!!")
        return;
      }
      
      $scope.$on('$destroy', () => {
        initialLoaderManager.unregister($attrs.initialLoader, this);        
      })

      this.hi = function(){
        alert('hi');
      }

      initialLoaderManager.register($attrs.initialLoader, this);

    
    }
    
    return directive;
    
  };
  

})();
