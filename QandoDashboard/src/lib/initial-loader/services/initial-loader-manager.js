(function() {
  'use strict';

  angular.module('initial-loader')
  .factory('initialLoaderManager', initialLoaderManager);

  function initialLoaderManager($q, $timeout){
    var svc = {};

    svc.makeLoader = function(f) {
      const loader = new Loader(f);
      loader.load();
      return loader;
    };

    return svc;
  };

  class Loader {
    constructor(loadingFunction) {
      this.loadingFunction = loadingFunction;
      this.loading = false;
      this.error = null;
      this.isRetry = false;
    }

    load() {
      if (this.loading) {
        return;
      }
      // Was error so is retry the loading
      this.isRetry = this.error !== null;

      // Reset
      this.error = null;
      this.loading = true;

      // Perform loading actions
      this.loadingFunction()
      .catch(err => { this.error = err; })
      .finally(() => { this.loading = false; });
    }
  }

})();
