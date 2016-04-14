angular.module('app')
.controller('ShopEditCtrl', ShoEditpCtrl);

function ShopCtrl ($scope, Entities, DataService, $timeout) {

  Entities
  .getShop().then(s => {
    this.shop=s;

    //DataService.getShopWeekWorkingHours(s.id).
  });

  //this.updateShop
}


