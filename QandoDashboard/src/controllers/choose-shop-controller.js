angular.module('app')
.controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl (Preferences, $state, $ionicHistory, DataService) {


  DataService.shops
  .getList()
  .then(shops => {
    console.log(shops);
    this.shops = shops;
  })
    

  this.setCurrentShop = (shop) => {
    Preferences.setCurrentShopId(shop.id);
    $ionicHistory.nextViewOptions({
            historyRoot : true,
            disableBack : true
    })
    $state.go('app.logged.home')
  }
  
}


