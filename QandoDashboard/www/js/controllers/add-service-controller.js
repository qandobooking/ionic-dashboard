'use strict';

angular.module('app').controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl(Entities, DataService, $state, initialLoaderManager) {
  var _this = this;

  this.newService = {};
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

    DataService.getSimpleServices(_this.shop.id).post(newServiceForPost).then(function () {
      $state.go('app.logged.services');
    });
  };

  this.setServiceDuration = function () {
    _this.newService.service_duration = moment(_this.serviceTime).format('HH:mm:ss');
  };
}