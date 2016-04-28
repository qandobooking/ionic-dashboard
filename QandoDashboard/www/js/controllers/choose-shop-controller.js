'use strict';

angular.module('app').controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl(Preferences, $state, $ionicHistory, DataService, Entities, initialLoaderManager) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return DataService.shops.getList().then(function (shops) {
      _this.shops = shops;
    });
  });

  this.setCurrentShop = function (shop) {
    Preferences.setCurrentShopId(shop.id);
    Entities.setCurrentShop(shop);
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });
    $state.go('app.logged.home');
  };
}