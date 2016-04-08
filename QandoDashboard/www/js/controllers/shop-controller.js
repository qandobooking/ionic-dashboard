'use strict';

angular.module('app').controller('ShopCtrl', ShopCtrl);

function ShopCtrl($scope, Preferences, $state, $ionicHistory, DataService, Entities, TimeUtils, $ionicPopup, $timeout) {
    var _this = this;

    var restangularItems;
    this.weekDays = TimeUtils.getWeekDays();
    this.weekDaysNames = TimeUtils.getWeekDaysNames();
    this.readOnly = true;
    this.redrawFunctions = {};

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
        var restangularItem = restangularItems[range.id];
        if (range.id) {
            restangularItem.start_time = range.start.format("HH:mm");
            restangularItem.end_time = range.end.format("HH:mm");
            console.log(restangularItem.start_time);
            console.log(restangularItem.end_time);
            restangularItem.save();
        } else {

            DataService.getShopWeekWorkingHours(_this.shop.id).post({
                start_time: range.start.format("HH:mm"),
                end_time: range.end.format("HH:mm"),
                weekday: range.weekday
            }).then(function (savedRange) {
                restangularItems[savedRange.id] = savedRange;
                range.id = savedRange.id;
                _this.redrawFunctions[range.weekday].setId(range, range.id);
            });
        }
    };

    this.addToDay = function (day) {
        var newRange = {
            weekday: day,
            start: moment({ hour: 0 }),
            end: moment({ hour: 1 })
        };

        this.byWeekDay[day].push(newRange);
        this.redrawFunctions[day].setRanges(this.byWeekDay[day]);
    };

    this.toggleEdit = function () {
        var _this2 = this;

        this.readOnly = !this.readOnly;
        _.each(this.redrawFunctions, function (it) {
            it.setReadonly(_this2.readOnly);
        });
    };

    this.onDoubleTap = function (el, day, idx) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                var candidate = _this.byWeekDay[day][idx];
                DataService.getShopWeekWorkingHours(_this.shop.id).one(candidate.id).remove().then(function () {

                    _this.byWeekDay[day].splice(idx, 1);
                    _this.redrawFunctions[day].setRanges(_this.byWeekDay[day]);
                });
            } else {
                console.log('You are not sure');
            }
        });
    };
}