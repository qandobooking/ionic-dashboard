'use strict';

angular.module('app').controller('ShopSpecialClosingDaysCtrl', ShopSpecialClosingDaysCtrl);

function ShopSpecialClosingDaysCtrl($stateParams, $ionicHistory, $state, Entities, DataService) {
    var _this = this;

    this.year = $stateParams.year === undefined ? moment().year() : parseInt($stateParams.year);
    var restangularItems = {};

    Entities.getShop().then(function (s) {
        _this.shop = s;
        DataService.getShopClosingDays(s.id).getList({ 'date__year': _this.year, 'fixed': false }).then(function (response) {

            _this.closingDays = response.map(function (item) {
                restangularItems[item.date] = item;
                return moment(item.date);
            });
        });
    });

    this.toPrevYear = function () {
        $state.go('app.logged.shop-special-closingdays', {
            year: _this.year - 1
        }, { location: 'replace' });
    };

    this.toNextYear = function () {
        $state.go('app.logged.shop-special-closingdays', {
            year: _this.year + 1
        }, { location: 'replace' });
    };

    this.onDayToggled = function (d, selected) {
        var date = d.format("YYYY-MM-DD");

        if (selected) {
            var item = { fixed: false, date: date };
            DataService.getShopClosingDays(_this.shop.id).post(item).then(function (savedItem) {
                restangularItems[date] = savedItem;
            });
        } else {
            var oldItem = restangularItems[date];
            oldItem.remove().then(function () {
                delete restangularItems[date];
            });
        }
    };

    this.goBack = function () {
        $state.go("app.logged.shop", { shopId: _this.shop.id });
    };
}