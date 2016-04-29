'use strict';

angular.module('app').controller('BookingCtrl', BookingCtrl);

function BookingCtrl(Entities, DataService, $stateParams, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {
  var _this = this;

  this.bookingId = $stateParams.bookingId;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getBookings(s.id).one(_this.bookingId).get().then(function (response) {
        _this.booking = response;
      });
    });
  });

  this.action = function (actionName) {
    $ionicLoading.show();
    DataService.bookings.one(_this.bookingId).oneUrl(actionName).post().then(function (response) {
      $state.go('app.logged.bookings', {
        bookingStatus: $stateParams.bookingStatus
      });
    }).catch(function (error) {
      notifyManager.error(HttpUtils.makeErrorMessage(error));
    }).finally(function () {
      $ionicLoading.hide();
    });
  };
}