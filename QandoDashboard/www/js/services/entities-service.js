"use strict";

(function () {
  "use strict";

  angular.module("app").factory('Entities', Entities);

  function Entities(baseServerUrl, Preferences, $q, store, $auth, DataService, $rootScope) {
    var svc = {};
    var user = $q.defer();
    var shop = $q.defer();

    svc.getUser = function () {
      return user.promise;
    };
    svc.getShop = function () {
      return shop.promise;
    };

    $rootScope.$on("app:loginSuccess", function (evt, data) {
      svc.loadCurrentUser();
    });

    $rootScope.$on("app:logoutSuccess", function (evt, data) {
      user = $q.defer();
      shop = $q.defer();
      $rootScope.$broadcast('Entities:userChanged', null);
      $rootScope.$broadcast('Entities:shopChanged', null);
    });

    svc.loadCurrentUser = function () {
      DataService.me.get().then(function (u) {
        user.resolve(u);
        $rootScope.$broadcast('Entities:userChanged', u);
      }).catch(function (err) {
        if (err.status === 500 || err.status <= 0) {
          $rootScope.$broadcast('Entities:loadUserError', err);
        }
      });
    };

    svc.loadCurrentShop = function (shopId) {

      DataService.shops.one(shopId).get().then(function (s) {
        shop.resolve(s);
        $rootScope.$broadcast('Entities:shopChanged', s);
      }).catch(function (err) {
        if (err.status === 500 || err.status <= 0) {
          $rootScope.$broadcast('Entities:loadShopError', err);
        } else if (err.status === 404) {
          $rootScope.$broadcast('Entities:invalidShop', err);
          shop = $q.defer();
        }
      });
    };

    svc.setCurrentShop = function (s) {
      shop = $q.defer();
      shop.resolve(s);
      $rootScope.$broadcast('Entities:shopChanged', s);
    };

    svc.bootstrap = function () {
      $rootScope.$broadcast('Entities:bootstrapStart');

      if ($auth.isAuthenticated()) {
        svc.loadCurrentUser();
      }

      var shopId = Preferences.getCurrentShopId();
      if (shopId) {
        svc.loadCurrentShop(shopId);
      }
    };

    return svc;
  }
})();