'use strict';

angular.module('app').controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl(Entities, DataService, $state) {
  var _this = this;

  this.newService = {};

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getResourceTypes(s.id).getList().then(function (response) {
      if (response.length === 1) {
        _this.newService.resource_type = response[0].plain();
      }
      _this.resourceTypes = response.plain();
    });
  });

  this.addService = function () {
    var newServiceForPost = Object.assign({}, _this.newService, { resource_type: _this.newService.resource_type.id });

    DataService.getSimpleServices(_this.shop.id).post(newServiceForPost).then(function () {
      $state.go('app.logged.services');
    });
  };
}