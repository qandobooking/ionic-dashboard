(function(){
"use strict";

angular.module("app")
.factory('Entities', Entities);

function Entities(baseServerUrl, Preferences, store, $auth, DataService, $rootScope){
    var svc = {  }
    var user = null;
    var shop = null;

    svc.getUser = () => user;
    svc.getShop = () => shop;

    $rootScope.$on("app:loginSuccess", (evt, data) => {
      svc.loadCurrentUser();  
    });

    $rootScope.$on("app:logoutSuccess", (evt, data) => {
      user = null;
      shop = null;
    });

    
    svc.loadCurrentUser = function() {
      DataService.me
      .get()
      .then(u => {
          user = u;
      })
    }

    svc.loadCurrentShop = function(shopId) {

      DataService.shops.one(shopId)
      .get()
      .then(s => {
          shop = s;
      })
    };

    svc.setCurrentShop = function(s){
      shop = s;
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


    svc.setEntity = (key, value) => {

    }
    



    return svc;    
}



})();