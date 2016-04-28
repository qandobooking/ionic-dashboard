angular.module('app')
.controller('BookingsCtrl', BookingsCtrl);

function BookingsCtrl (Entities, DataService, $stateParams, $ionicHistory, $state, initialLoaderManager) {

  this.bookingStatus = $stateParams.bookingStatus || 'pending';

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService
      .getBookings(s.id)
      .getList({ status : this.bookingStatus })
      .then(response => {
        this.bookings = response;
      });
    })
  ));

  this.toBookings = (status) => {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.bookings', {
        bookingStatus : status
    }, { location:'replace'});
  }



}


