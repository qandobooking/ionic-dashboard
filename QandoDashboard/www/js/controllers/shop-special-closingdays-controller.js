'use strict';

angular.module('app').controller('ShopSpecialClosingDaysCtrl', ShopSpecialClosingDaysCtrl);

function ShopSpecialClosingDaysCtrl($stateParams, $ionicHistory, $state, Entities, DataService, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  var restangularItems = {};
  this.year = $stateParams.year === undefined ? moment().year() : parseInt($stateParams.year);
  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getShopClosingDays(s.id).getList({ 'date__year': _this.year, 'fixed': false }).then(function (response) {
        _this.closingDays = response.map(function (item) {
          restangularItems[item.date] = item;
          return moment(item.date);
        });
      });
    });
  });

  this.toPrevYear = function () {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.shop-special-closingdays', {
      year: _this.year - 1
    }, { location: 'replace' });
  };

  this.toNextYear = function () {
    $ionicHistory.currentView($ionicHistory.backView());
    $state.go('app.logged.shop-special-closingdays', {
      year: _this.year + 1
    }, { location: 'replace' });
  };

  this.onDayToggled = function (d, selected) {
    var date = d.format("YYYY-MM-DD");

    if (selected) {
      var item = { date: date, fixed: false };
      DataService.getShopClosingDays(_this.shop.id).post(item).then(function (savedItem) {
        restangularItems[date] = savedItem;
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    } else {
      var oldItem = restangularItems[date];
      oldItem.remove().then(function () {
        delete restangularItems[date];
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };

  this.goBack = function () {
    $state.go("app.logged.shop", { shopId: _this.shop.id });
  };
}