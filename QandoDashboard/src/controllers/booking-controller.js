angular.module('app')
.controller('BookingCtrl', BookingCtrl);

function BookingCtrl (Entities, DataService, $stateParams, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils, $ionicPopup, bookingStatusNames) {

  this.bookingStatusNames = bookingStatusNames;
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
        console.log(response);
        this.booking = response;
      });
    })
  ));

  // Map action to popup config
  const popoupActionConfMap = {
    confirm: {
      title: 'Conferma appuntamento',
      template: `Sicuro di voler confermare l'appuntamento?`
    },
    deny: {
      title: 'Nega appuntamento',
      template: `Sicuro di voler negare l'appuntamento?`
    },

  };

  this.action = actionName => {
    const confirmPopup = $ionicPopup.confirm(popoupActionConfMap[actionName]);

    confirmPopup.then(confirmed => {
      if (confirmed) {
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
      }
    });
  };

}
