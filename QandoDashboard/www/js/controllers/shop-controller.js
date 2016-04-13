'use strict';

angular.module('app').controller('ShopCtrl', ShopCtrl);

function ShopCtrl($scope, Entities, $timeout) {
  var _this = this;

  Entities.getShop().then(function (s) {
    _this.shop = s;
  });
}