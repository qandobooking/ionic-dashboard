(function() {
  'use strict';

  angular.module('initial-loader')
  .factory('initialLoaderManager', initialLoaderManager);

  function initialLoaderManager($q, $timeout){
    var svc = {};

    svc.getLoader = function(f){
      let loader = new Loader(f);
      loader.load()
      return loader;
    }

    return svc;
  };


  class Loader {
    constructor(loadingFunction) {
        this.loadingFunction = loadingFunction;
        this.loading = false;
        this.error = null;
    }

    load() {
        if (this.loading) { return }
        this.error = null;
        this.loading = true;
        this.loadingFunction()
        //.then()
        .catch(err => { this.error = err; })
        .finally(()=>{ this.loading = false; })
    }
  }
  

})();
