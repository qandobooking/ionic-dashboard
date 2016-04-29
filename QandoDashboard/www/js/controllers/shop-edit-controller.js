'use strict';

angular.module('app').controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl($scope, Entities, DataService, $state, $ionicLoading, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s.clone();
    });
  });

  this.updateShop = function () {
    $ionicLoading.show();
    _this.shop.save().then(function (savedShop) {
      _this.serverErrors = {};
      Entities.setCurrentShop(savedShop);
      $state.go('app.logged.shop', { shopId: savedShop.id });
    }).catch(function (error) {
      if (error.status === 400) {
        _this.serverErrors.params = error.data;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
    }).finally(function () {
      $ionicLoading.hide();
    });
  };
}