angular.module('app')
.controller('ShopCtrl', ShopCtrl);

function ShopCtrl (Preferences, $state, $ionicHistory, DataService, Entities) {

  this.shop = Entities.getShop();

  this.testWorkingHours = [
    { start: moment({ hour:0, minute:0 }), end: moment({ hour:12, minute:0 })},
    { start: moment({ hour:13, minute:0 }), end: moment({ hour:24, minute:0 })},
  ]
  
  
}


