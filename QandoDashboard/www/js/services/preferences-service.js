"use strict";

(function () {
    "use strict";

    angular.module("app").factory('Preferences', Preferences);

    function Preferences(baseServerUrl, store) {
        var svc = {};

        svc.getCurrentShopId = function () {
            return store.get('currentShopId');
        };
        svc.setCurrentShopId = function (shopId) {
            return store.set('currentShopId', shopId);
        };

        svc.clearPreferences = function () {
            store.remove('currentShopId');
        };

        return svc;
    }
})();