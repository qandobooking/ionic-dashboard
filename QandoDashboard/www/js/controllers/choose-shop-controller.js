'use strict';

angular.module('app').controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl(Preferences, $state, $ionicHistory, DataService) {
  var _this = this;

  DataService.shops.getList().then(function (shops) {
    console.log(shops);
    _this.shops = shops;
  });

  this.setCurrentShop = function (shop) {
    Preferences.setCurrentShopId(shopId);
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true
    });
    $state.go('app.logged.home');
  };
}