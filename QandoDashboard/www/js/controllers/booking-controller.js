'use strict';

angular.module('app').controller('BookingCtrl', BookingCtrl);

function BookingCtrl(Entities, DataService, $stateParams, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils, $ionicPopup, bookingStatusNames) {
  var _this = this;

  this.bookingStatusNames = bookingStatusNames;
  this.bookingId = $stateParams.bookingId;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getBookings(s.id).one(_this.bookingId).get().then(function (response) {
        console.log(response);
        _this.booking = response;
      });
    });
  });

  // Map action to popup config
  var popoupActionConfMap = {
    confirm: {
      title: 'Conferma appuntamento',
      template: 'Sicuro di voler confermare l\'appuntamento?'
    },
    deny: {
      title: 'Nega appuntamento',
      template: 'Sicuro di voler negare l\'appuntamento?'
    }

  };

  this.action = function (actionName) {
    var confirmPopup = $ionicPopup.confirm(popoupActionConfMap[actionName]);

    confirmPopup.then(function (confirmed) {
      if (confirmed) {
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
      }
    });
  };
}