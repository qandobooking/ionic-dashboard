'use strict';

angular.module('app').controller('ShopSpecialClosingDaysCtrl', ShopSpecialClosingDaysCtrl);

function ShopSpecialClosingDaysCtrl($stateParams, $ionicHistory, $state, Entities) {
  var _this = this;

  this.closingDays = [moment('0004-09-29')];

  Entities.getShop().then(function (s) {
    _this.shop = s;
  });

  this.year = $stateParams.year === undefined ? moment().year() : parseInt($stateParams.year);

  this.toPrevYear = function () {
    $state.go('app.logged.shop-special-closingdays', {
      year: _this.year - 1
    }, { location: 'replace' });
  };

  this.toNextYear = function () {
    $state.go('app.logged.shop-special-closingdays', {
      year: _this.year + 1
    }, { location: 'replace' });
  };

  this.onDayToggled = function (d, selected) {
    console.log(d.format());
    console.log(selected);
  };

  this.goBack = function () {
    $state.go("app.logged.shop", { shopId: _this.shop.id });
  };
}