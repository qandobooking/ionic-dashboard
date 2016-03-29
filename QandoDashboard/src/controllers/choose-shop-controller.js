angular.module('app')
.controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl (Preferences, $state) {

  this.setCurrent = () => {
    Preferences.setCurrentShopId(1);
    $state.go('app.home')
  }
  
}


