angular.module('app')
.controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl ($scope, Entities, DataService, $state, $ionicLoading, initialLoaderManager, notifyManager, HttpUtils) {

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop().then(s => {
      this.shop = s.clone();
    })
  ));

  this.updateShop = () => {
    $ionicLoading.show();
    this.shop.save().then(savedShop => {
      this.serverErrors = {};
      Entities.setCurrentShop(savedShop);
      $state.go('app.logged.shop', { shopId: savedShop.id });
    })
    .catch((error) => {
      if (error.status === 400) {
        this.serverErrors.params = error.data;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
    })
    .finally(() => { $ionicLoading.hide() });
  };
}


