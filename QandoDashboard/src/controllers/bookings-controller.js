angular.module('app')
.controller('BookingsCtrl', BookingsCtrl);

function BookingsCtrl (Entities, DataService, $stateParams, $ionicHistory, $state) {

  this.bookingStatus = $stateParams.bookingStatus || 'pending';

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService
    .getBookings(s.id)
    .getList({ status : this.bookingStatus })
    .then(response => {
      this.bookings = response;
    })
  });

  this.toBookings = (status) => {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.bookings', {
        bookingStatus : status
    }, { location:'replace'});
  }



}


