'use strict';

angular.module('app').controller('BookingsCtrl', BookingsCtrl);

function BookingsCtrl(Entities, DataService, $stateParams, $ionicHistory, $state) {
  var _this = this;

  this.bookingStatus = $stateParams.bookingStatus || 'pending';

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getBookings(s.id).getList({ status: _this.bookingStatus }).then(function (response) {
      _this.bookings = response;
    });
  });

  this.toBookings = function (status) {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.bookings', {
      bookingStatus: status
    }, { location: 'replace' });
  };
}