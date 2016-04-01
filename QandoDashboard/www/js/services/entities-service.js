"use strict";

(function () {
    "use strict";

    angular.module("app").factory('Entities', Entities);

    function Entities(baseServerUrl, Preferences, store, $auth, DataService, $rootScope) {
        var svc = {};
        var user = null;

        svc.getUser = function () {
            return user;
        };

        $rootScope.$on("app:loginSuccess", function (evt, data) {
            svc.loadCurrentUser();
        });

        $rootScope.$on("app:logoutSuccess", function (evt, data) {
            user = null;
        });

        svc.loadCurrentUser = function () {
            DataService.me.get().then(function (u) {
                user = u;
            });
        };

        svc.loadCurrentShop = function (shopId) {
            var _this = this;

            DataService.shops.one(shopId).get().then(function (shop) {
                _this.shop = shop;
            });
        };

        svc.bootstrap = function () {
            if ($auth.isAuthenticated()) {
                svc.loadCurrentUser();
            }
            /*
            const shopId = Preferences.getCurrentShopId();
            if (shopId) {
                svc.loadCurrentShop(shopId)
            }
            */
        };

        svc.setEntity = function (key, value) {};

        return svc;
    }
})();