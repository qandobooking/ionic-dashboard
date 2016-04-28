angular.module('app')
.controller('ShopSpecialClosingDaysCtrl', ShopSpecialClosingDaysCtrl);

function ShopSpecialClosingDaysCtrl ($stateParams, $ionicHistory, $state, Entities, DataService, initialLoaderManager) {

  var restangularItems = {};
  this.year = $stateParams.year === undefined ? moment().year() : parseInt($stateParams.year);
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService
      .getShopClosingDays(s.id)
      .getList({'date__year': this.year, 'fixed' : false })
      .then(response => {
        this.closingDays = response.map(item => {
          restangularItems[item.date] = item;
          return moment(item.date)
        });
      });
    })
  ));

  this.toPrevYear = () => {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.shop-special-closingdays', {
      year: this.year - 1
    }, { location:'replace' })
  };

  this.toNextYear = () => {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.shop-special-closingdays', {
      year: this.year + 1
    }, { location:'replace'})
  };

  this.onDayToggled = (d, selected) => {
    let date = d.format("YYYY-MM-DD");

    if (selected) {
      const item = { fixed: false, date: date };
      DataService
      .getShopClosingDays(this.shop.id)
      .post(item)
      .then(savedItem => {
        restangularItems[date] = savedItem;
      });
    } else {
      const oldItem = restangularItems[date];
      oldItem
      .remove()
      .then(() => {
        delete restangularItems[date]
      });
    }
  };

  this.goBack = () => {
    $state.go("app.logged.shop", { shopId: this.shop.id });
  };
}
