'use strict';

angular.module('app').controller('ShopClosingDaysCtrl', ShopClosingDaysCtrl);

function ShopClosingDaysCtrl(Entities, DataService, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  var restangularItems = {};

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getShopClosingDays(s.id).getList({ 'fixed': true }).then(function (response) {
        _this.closingDays = response.map(function (item) {
          restangularItems[item.date] = item;
          return moment(item.date);
        });
      });
    });
  });

  this.onDayToggled = function (d, selected, resetCallback) {
    var date = d.format('YYYY-MM-DD');
    if (selected) {
      var item = { date: date, fixed: true };
      DataService.getShopClosingDays(_this.shop.id).post(item).then(function (savedItem) {
        restangularItems[date] = savedItem;
      }).catch(function (error) {
        resetCallback();
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    } else {
      var oldItem = restangularItems[date];
      oldItem.remove().then(function () {
        delete restangularItems[date];
      }).catch(function (error) {
        resetCallback();
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };
}