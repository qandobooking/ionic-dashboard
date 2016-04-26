angular.module('app')
.controller('BookingsCtrl', BookingsCtrl);

function BookingsCtrl (Entities, DataService, $stateParams) {

  this.bookingStatus = $stateParams.bookingStatus || 'pending';

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService
    .getBookings(s.id)
    .getList()
    .then(response => {
      this.bookings = response;
    })
  });



}


