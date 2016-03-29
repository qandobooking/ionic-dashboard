angular.module('app')
.controller('ChooseShopCtrl', ChooseShopCtrl);

function ChooseShopCtrl (Preferences, $state, $ionicHistory) {

  this.setCurrent = () => {
    Preferences.setCurrentShopId(1);
    $ionicHistory.nextViewOptions({
            historyRoot : true,
            disableBack : true
    })
    $state.go('app.logged.home')
  }
  
}


