(function(){
"use strict";

angular.module("app")
.factory('Entities', Entities);

function Entities(baseServerUrl, Preferences, store, $auth, DataService, $rootScope){
    var svc = {  }
    var user = null;

    svc.getUser = () => user;

    $rootScope.$on("app:loginSuccess", (evt, data) => {
      svc.loadCurrentUser();  
    });

    $rootScope.$on("app:logoutSuccess", (evt, data) => {
      user = null;
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
      .then(shop => {
          this.shop = shop;
      })
    }

    
    svc.bootstrap = () => {
        if ($auth.isAuthenticated) {
            svc.loadCurrentUser()
        }
        /*
        const shopId = Preferences.getCurrentShopId();
        if (shopId) {
            svc.loadCurrentShop(shopId)
        }
        */
    }


    svc.setEntity = (key, value) => {

    }
    



    return svc;    
}



})();