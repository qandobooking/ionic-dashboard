(function(){
"use strict";

angular.module("app")
.factory('Preferences', Preferences);

function Preferences(baseServerUrl, store){
    var svc = {}

    svc.getCurrentShopId = () => store.get('currentShopId');
    svc.setCurrentShopId = (shopId) => store.set('currentShopId', shopId);

    svc.clearPreferences = () => {
        store.remove('currentShopId');
    }


    return svc;    
}



})();