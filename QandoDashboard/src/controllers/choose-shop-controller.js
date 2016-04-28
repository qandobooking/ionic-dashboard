angular.module('app')
.controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl (Preferences, $state, $ionicHistory, DataService, Entities, initialLoaderManager) {

  this.loader = initialLoaderManager.makeLoader(() => (
    DataService.shops.getList()
    .then(shops => {
      this.shops = shops;
    })
  ));

  this.setCurrentShop = (shop) => {
    Preferences.setCurrentShopId(shop.id);
    Entities.setCurrentShop(shop);
    $ionicHistory.nextViewOptions({
      historyRoot : true,
      disableBack : true
    });
    $state.go('app.logged.home');
  };

}


