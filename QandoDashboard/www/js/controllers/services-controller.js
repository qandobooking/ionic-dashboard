'use strict';

angular.module('app').controller('ServicesCtrl', ServicesCtrl);

function ServicesCtrl(Entities, DataService, $ionicPopup, initialLoaderManager, $timeout) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getServices(s.id).getList().then(function (response) {
        _this.services = response;
      });
    });
  });

  this.dropService = function (service) {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Elimina servizio',
      template: 'Sicuro di voler eliminare il servizio ' + service.name
    });

    confirmPopup.then(function (res) {
      if (res) {
        service.remove().then(function () {
          _this.services = _.reject(_this.services, function (s) {
            return s.id == service.id;
          });
        });
      } else {
        console.log('You are not sure');
      }
    });
  };
}