(function() {
  'use strict';

  angular.module('initial-loader')
  .directive('initialLoader', initialLoader);

  function initialLoader($templateRequest, $compile){

    var directive  = {
      link,
      scope : { loader : "=initialLoader"}
    }
    
    function link(scope, element, iAttrs){
      var children = element.children();
      var tpl = iAttrs.loadingTemplate ? iAttrs.loadingTemplate : "templates/directives/initial_loader.html";
      var content;
      console.log(scope.loader)

      children.addClass('hide');

      $templateRequest(tpl)
      .then(function(template){
        var compiler = $compile(template);
        content = compiler(scope);
        content.addClass("hide");
        element.append(content)
        init()
      });


      function init(){
        scope.$watch('loader.loading', function(nv){
          children.toggleClass('hide', nv); 
          if(content){
            content.toggleClass('hide', !nv); 
          }
        });
      }
    
    }
    
    
    return directive;
    
  };
  

})();
