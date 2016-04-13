angular.module('app')
.controller('ShopCtrl', ShopCtrl);

function ShopCtrl ($scope, Entities, $timeout) {

  Entities
  .getShop().then(s => { 
    this.shop=s; 
  });
  
  
}


