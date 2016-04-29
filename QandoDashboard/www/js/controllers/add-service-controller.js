'use strict';

angular.module('app').controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl(Entities, DataService, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {
  var _this = this;

  this.newService = {};
  this.serverErrors = {};
  this.serviceTime = moment({ hours: 1 }).toDate();

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getResourceTypes(s.id).getList().then(function (response) {
        if (response.length === 1) {
          _this.newService.resource_type = response[0].plain();
        }
        _this.resourceTypes = response.plain();
      });
    });
  });

  this.addService = function () {
    var newServiceForPost = Object.assign({}, _this.newService, { resource_type: _this.newService.resource_type.id });

    $ionicLoading.show();
    DataService.getSimpleServices(_this.shop.id).post(newServiceForPost).then(function () {
      _this.serverErrors = {};
      $state.go('app.logged.services');
    }).catch(function (error) {
      if (error.status === 400) {
        _this.serverErrors.params = error.data;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
    }).finally(function () {
      $ionicLoading.hide();
    });
  };

  this.setServiceDuration = function () {
    _this.newService.service_duration = moment(_this.serviceTime).format('HH:mm:ss');
  };
}