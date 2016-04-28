'use strict';

angular.module('app').controller('ShopCtrl', ShopCtrl);

function ShopCtrl($scope, Entities, initialLoaderManager) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
    });
  });
}