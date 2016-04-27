(function() {
  'use strict';

  angular.module('initial-loader')
  .factory('initialLoaderManager', initialLoaderManager);

  function initialLoaderManager($q, $timeout){
    var svc = {};

    var loaderFunctions = {};
    var reg = {};

    svc.start = function(key, f){
        
        loaderFunctions[key] = f;
        svc.performLoading(key);
        
    }

    var qs = {};

    svc.performLoading = function(key){
        //#TODO CHECK FUNCTION
        svc.onStartLoading(key);
        qs[key] = loaderFunctions[key]();

        qs[key]
        .then(() => svc.onSuccess(key))
        .catch(() => svc.onFail(key))
        .finally( function(){
            qs[key] = null;
        });
    }

    svc.onStartLoading = function(key){
        if (!reg[key]){
            return
        }
        reg[key].map(dir => dir.hi())
        
    }

    svc.onSuccess = function(key){

    }

    svc.onFail = function(key){

    }
    
    svc.register = function(key, dir){

        reg[key] = reg[key] || [];
        reg[key].push(dir);
        
        if(qs[key]){
            //pending
            if(qs[key].$$state.status === 0){
                svc.onStartLoading(key);
            }
            //resolved
            else if(qs[key].$$state.status === 1){
                svc.onStartLoading(key);
                svc.onSuccess(key);
            }
            //rejected
            else if(qs[key].$$state.status === 1){
                svc.onStartLoading(key);
                svc.onFail(key);
            }
        }
        
    }

    svc.unregister = function(key, dir){
        reg[key] = _.reject(reg[key], dir)
    }

    return svc;
  };
  

})();
