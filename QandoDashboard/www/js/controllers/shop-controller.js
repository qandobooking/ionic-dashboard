'use strict';

angular.module('app').controller('ShopCtrl', ShopCtrl);

function ShopCtrl(Preferences, $state, $ionicHistory, DataService, Entities, TimeUtils) {
    var _this = this;

    var restangularItems;
    this.weekDays = TimeUtils.getWeekDays();
    this.weekDaysNames = TimeUtils.getWeekDaysNames();

    Entities.getShop().then(function (s) {
        _this.shop = s;
        DataService.getShopWeekWorkingHours(s.id).getList().then(function (weekWorkingHours) {

            restangularItems = _.keyBy(weekWorkingHours, 'id');

            var moments = _.map(weekWorkingHours.plain(), function (w) {
                return {
                    id: w.id,
                    start: moment(w.start_time, "HH:mm"),
                    end: moment(w.end_time, "HH:mm"),
                    weekday: w.weekday
                };
            });
            var byWeekDay = _.groupBy(moments, 'weekday');
            _.each(_this.weekDays, function (d) {
                if (!byWeekDay[d]) {
                    byWeekDay[d] = [];
                }
            });
            _this.byWeekDay = byWeekDay;
        });
    });

    this.onRangeUpdate = function (range) {
        console.log(range);

        var restangularItem = restangularItems[range.id];
        restangularItem.start_time = range.start.format("HH:mm");
        restangularItem.end_time = range.end.format("HH:mm");
        console.log(restangularItem.start_time);
        console.log(restangularItem.end_time);
        restangularItem.save();
    };

    this.testWorkingHours = [{ start: moment({ hour: 0, minute: 0 }), end: moment({ hour: 12, minute: 0 }) }, { start: moment({ hour: 13, minute: 0 }), end: moment({ hour: 24, minute: 0 }) }];
}