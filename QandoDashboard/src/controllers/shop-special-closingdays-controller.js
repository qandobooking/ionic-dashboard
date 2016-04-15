angular.module('app')
.controller('ShopSpecialClosingDaysCtrl', ShopSpecialClosingDaysCtrl);

function ShopSpecialClosingDaysCtrl ($stateParams, $ionicHistory, $state, Entities) {

  this.closingDays = [
    moment('0004-09-29')
  ];
  
  Entities
  .getShop().then(s => {
    this.shop=s;
  });

  this.year = $stateParams.year === undefined ? moment().year() : parseInt($stateParams.year);

  this.toPrevYear = () => {
    $state.go('app.logged.shop-special-closingdays', {
        year:this.year - 1
    }, { location:'replace'})
  }
  
  this.toNextYear = () => {
    $state.go('app.logged.shop-special-closingdays', {
        year:this.year + 1
    }, { location:'replace'})
  }

  this.onDayToggled = function (d, selected) {
    console.log(d.format());
    console.log(selected);
  };

  this.goBack = () => {
    $state.go("app.logged.shop", { shopId : this.shop.id })
  }

 
}


