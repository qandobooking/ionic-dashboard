'use strict';

(function () {
  'use strict';

  angular.module('initial-loader').directive('initialLoader', initialLoader);

  function initialLoader($templateRequest, $compile) {
    var directive = {
      link: link,
      scope: { loader: '=initialLoader' }
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
          children.toggleClass('hide', showLoadingContent);

          if (loading && !scope.loader.isRetry) {
            element.append(content);
          }

          if (!loading && !scope.loader.error) {
            content.remove();
          }
        });
      }
    }

    return directive;
  };
})();