angular.module('app')
.controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl ($scope, Entities, DataService, $timeout, $state, initialLoaderManager) {

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop().then(s => {
      this.shop = s.clone();
    })
  ));

  this.updateShop = () => {
    this.shop.save().then( savedShop => {
      this.serverErrors = {};
      Entities.setCurrentShop(savedShop)
      $state.go("app.logged.shop", {shopId:savedShop.id})
    })
    .catch((error) => {
      this.serverErrors.params = error.data;
    });
  };
}


