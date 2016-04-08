(function(){
"use strict";

angular.module("app")
.factory('Entities', Entities);

function Entities(baseServerUrl, Preferences, $q, store, $auth, DataService, $rootScope){
    var svc = {  }
    var user = $q.defer();
    var shop = $q.defer();

    svc.getUser = () => user.promise;
    svc.getShop = () => shop.promise;

    $rootScope.$on("app:loginSuccess", (evt, data) => {
      svc.loadCurrentUser();  
    });

    $rootScope.$on("app:logoutSuccess", (evt, data) => {
      user = $q.defer();
      shop = $q.defer();
      $rootScope.$broadcast('Entities:userChanged', null)
      $rootScope.$broadcast('Entities:shopChanged', null)
    });

    
    svc.loadCurrentUser = function() {
      DataService.me
      .get()
      .then(u => {
          user.resolve(u);
          $rootScope.$broadcast('Entities:userChanged', u)
      })
    }

    svc.loadCurrentShop = function(shopId) {

      DataService.shops.one(shopId)
      .get()
      .then(s => {
          shop.resolve(s);
          $rootScope.$broadcast('Entities:shopChanged', s)
      })
    };

    svc.setCurrentShop = function(s){
      shop = $q.when(s);
      $rootScope.$broadcast('Entities:shopChanged', s)
    }

    
    svc.bootstrap = () => {
        if ($auth.isAuthenticated()) {
            svc.loadCurrentUser()
        }
        
        const shopId = Preferences.getCurrentShopId();
        if (shopId) {
            svc.loadCurrentShop(shopId)
        }
        
    }
 
    



    return svc;    
}



})();