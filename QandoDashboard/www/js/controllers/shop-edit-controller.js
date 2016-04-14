'use strict';

angular.module('app').controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl($scope, Entities, DataService, $timeout) {
  var _this = this;

  Entities.getShop().then(function (s) {
    _this.shop = s;
  });

  this.serverErrors = {};

  this.updateShop = function () {
    var _this2 = this;

    this.shop.save().then(function () {
      _this2.serverErrors = {};
      console.log('OK!');
    }).catch(function (error) {
      _this2.serverErrors.params = error.data;
      console.log(_this2.serverErrors);
    });
  };
}