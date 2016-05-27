'use strict';

(function () {
  'use strict';

  angular.module('initial-loader').directive('initialLoader', initialLoader);

  function initialLoader($templateRequest, $compile) {
    var directive = {
      link: link,
      scope: { loader: '=initialLoader', contentClasses: '@' }
    };

    function link(scope, element, iAttrs) {
      var content;
      var children = element.children();
      var tpl = typeof iAttrs.loadingTemplate !== 'undefined' ? iAttrs.loadingTemplate : 'templates/directives/initial_loader.html';

      $templateRequest(tpl).then(function (template) {
        var compiler = $compile(template);
        content = compiler(scope);
        init();
      });

      function init() {
        scope.$watch('loader.loading', function (loading) {

          var showLoadingContent = loading || !!scope.loader.error;
          //children.toggleClass('hide', showLoadingContent);
          if (!showLoadingContent) {
            children.toggleClass('fadein', true);
          } else {
            children.toggleClass('faded', true);
          }

          if (loading && !scope.loader.isRetry) {
            content.addClass('faded');
            element.append(content);
            content.addClass('fadein');
          }

          if (!loading && !scope.loader.error) {
            content.addClass('fadeout'); //remove();
            setTimeout(function () {
              content.remove();
            }, 2000);
          }
        });
      }
    }

    return directive;
  };
})();