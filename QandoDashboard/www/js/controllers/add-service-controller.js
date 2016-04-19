'use strict';

angular.module('app').controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl(Entities, DataService) {
  var _this = this;

  this.newService = {};

  Entities.getShop().then(function (s) {
    _this.shop = s;
  });
}