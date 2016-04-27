'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  angular.module('initial-loader').factory('initialLoaderManager', initialLoaderManager);

  function initialLoaderManager($q, $timeout) {
    var svc = {};

    svc.getLoader = function (f) {
      var loader = new Loader(f);
      loader.load();
      return loader;
    };

    return svc;
  };

  var Loader = function () {
    function Loader(loadingFunction) {
      _classCallCheck(this, Loader);

      this.loadingFunction = loadingFunction;
      this.loading = false;
      this.error = null;
    }

    _createClass(Loader, [{
      key: 'load',
      value: function load() {
        var _this = this;

        if (this.loading) {
          return;
        }
        this.error = null;
        this.loading = true;
        this.loadingFunction()
        //.then()
        .catch(function (err) {
          _this.error = err;
        }).finally(function () {
          _this.loading = false;
        });
      }
    }]);

    return Loader;
  }();
})();