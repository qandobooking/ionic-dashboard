angular.module('app')
.controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl ($scope, Entities, DataService, $timeout) {

  Entities
  .getShop().then(s => {
    this.shop=s;
  });

  this.serverErrors = {};

  this.updateShop = function() {
    this.shop.save().then(() => {
      this.serverErrors = {};
      console.log('OK!')
    })
    .catch((error) => {
      this.serverErrors.params = error.data;
      console.log(this.serverErrors);
    });
  };
}


