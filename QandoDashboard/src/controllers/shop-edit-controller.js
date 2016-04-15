angular.module('app')
.controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl ($scope, Entities, DataService, $timeout, $state) {

  Entities
  .getShop().then(s => {
    this.shop=s.clone();
  });

  this.serverErrors = {};

  this.updateShop = () => {
    this.shop.save().then( savedShop => {
      this.serverErrors = {};
      Entities.setCurrentShop(savedShop)
      $state.go("app.logged.shop", {shopId:savedShop.id})
    })
    .catch((error) => {
      this.serverErrors.params = error.data;
      console.log(this.serverErrors);
    });
  };
}


