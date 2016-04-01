"use strict";

(function () {
    "use strict";

    angular.module("app").factory('Entities', Entities);

    function Entities(baseServerUrl, Preferences, store, $auth, DataService, $rootScope) {
        var svc = {};
        var user = null;
        var shop = null;

        svc.getUser = function () {
            return user;
        };
        svc.getShop = function () {
            return shop;
        };

        $rootScope.$on("app:loginSuccess", function (evt, data) {
            svc.loadCurrentUser();
        });

        $rootScope.$on("app:logoutSuccess", function (evt, data) {
            user = null;
            shop = null;
        });

        svc.loadCurrentUser = function () {
            DataService.me.get().then(function (u) {
                user = u;
            });
        };

        svc.loadCurrentShop = function (shopId) {

            DataService.shops.one(shopId).get().then(function (s) {
                shop = s;
            });
        };

        svc.setCurrentShop = function (s) {
            shop = s;
        };

        svc.bootstrap = function () {
            if ($auth.isAuthenticated()) {
                svc.loadCurrentUser();
            }

            var shopId = Preferences.getCurrentShopId();
            if (shopId) {
                svc.loadCurrentShop(shopId);
            }
        };

        svc.setEntity = function (key, value) {};

        return svc;
    }
})();