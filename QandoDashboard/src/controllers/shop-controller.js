angular.module('app')
.controller('ShopCtrl', ShopCtrl);

function ShopCtrl ($scope, Entities, initialLoaderManager) {

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop().then(s => {
      this.shop = s;
    })
  ));
}
