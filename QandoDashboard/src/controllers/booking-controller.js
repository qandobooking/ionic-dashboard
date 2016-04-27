angular.module('app')
.controller('BookingCtrl', BookingCtrl);

function BookingCtrl (Entities, DataService, $stateParams, $state) {

  this.bookingId = $stateParams.bookingId;

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService
    .getBookings(s.id)
    .one(this.bookingId)
    .get()
    .then(response => {
      this.booking = response;

    })
  });


  this.action = actionName => {
    DataService
    .bookings
    .one(this.bookingId)
    .oneUrl(actionName)
    .post()
    .then( response => {
      $state.go('app.logged.bookings', { bookingStatus:$stateParams.bookingStatus})
    })
  }

 



}


