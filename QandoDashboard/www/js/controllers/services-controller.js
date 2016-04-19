'use strict';

angular.module('app').controller('ServicesCtrl', ServicesCtrl);

function ServicesCtrl(Entities, DataService) {
  var _this = this;

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getServices(s.id).getList().then(function (response) {
      _this.services = response.plain();
      console.log(_this.services);
    });
  });
}