'use strict';

angular.module('app').controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl($scope, Entities, DataService, $state, $ionicLoading, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      var shop = s.clone();
      shop.min_booking_time = moment(shop.min_booking_time, 'HH:mm:ss').toDate();
      shop.min_confirm_time = moment(shop.min_confirm_time, 'HH:mm:ss').toDate();
      _this.shop = shop;
    });
  });

  this.updateShop = function () {
    var shop = _this.shop.clone();
    shop.min_booking_time = moment(new Date(_this.shop.min_booking_time)).format('HH:mm:ss');
    shop.min_confirm_time = moment(new Date(_this.shop.min_confirm_time)).format('HH:mm:ss');
    $ionicLoading.show();
    shop.save().then(function (savedShop) {
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