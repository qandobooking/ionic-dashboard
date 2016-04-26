'use strict';

angular.module('app').controller('BookingsCtrl', BookingsCtrl);

function BookingsCtrl(Entities, DataService, $stateParams) {
  var _this = this;

  this.bookingStatus = $stateParams.bookingStatus || 'pending';

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getBookings(s.id).getList().then(function (response) {
      _this.bookings = response;
    });
  });
}