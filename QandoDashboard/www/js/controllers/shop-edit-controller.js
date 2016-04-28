'use strict';

angular.module('app').controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl($scope, Entities, DataService, $timeout, $state, initialLoaderManager) {
  var _this = this;

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s.clone();
    });
  });

  this.updateShop = function () {
    _this.shop.save().then(function (savedShop) {
      _this.serverErrors = {};
      Entities.setCurrentShop(savedShop);
      $state.go("app.logged.shop", { shopId: savedShop.id });
    }).catch(function (error) {
      _this.serverErrors.params = error.data;
    });
  };
}