angular.module('app')
.controller('BookingCtrl', BookingCtrl);

function BookingCtrl (Entities, DataService, $stateParams, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {

  this.bookingId = $stateParams.bookingId;

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService
      .getBookings(s.id)
      .one(this.bookingId)
      .get()
      .then(response => {
        this.booking = response;
      });
    })
  ));

  this.action = actionName => {
    $ionicLoading.show();
    DataService
    .bookings
    .one(this.bookingId)
    .oneUrl(actionName)
    .post()
    .then(response => {
      $state.go('app.logged.bookings', {
        bookingStatus: $stateParams.bookingStatus
      });
    })
    .catch((error) => {
      notifyManager.error(HttpUtils.makeErrorMessage(error));
    })
    .finally(() => { $ionicLoading.hide() });
  };

}
