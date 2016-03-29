'use strict';

angular.module('app').controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl(Preferences, $state) {

  this.setCurrent = function () {
    Preferences.setCurrentShopId(1);
    $state.go('app.home');
  };
}