'use strict';

angular.module('app').controller('ShopWeekHoursCtrl', ShopWeekHoursCtrl);

function ShopWeekHoursCtrl(DataService, Entities, TimeUtils, $ionicPopup, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  var restangularItems = {};
  this.weekDays = TimeUtils.getWeekDays();
  this.weekDaysNames = TimeUtils.getWeekDaysNames();
  this.readOnly = true;
  this.redrawFunctions = {};
  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getShopWeekWorkingHours(s.id).getList().then(function (weekWorkingHours) {
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
        _this.byWeekDayBackup = _.cloneDeep(_this.byWeekDay);
      });
    });
  });

  this.onRangeUpdate = function (range) {
    var restangularItem = restangularItems[range.id];

    if (range.id) {
      (function () {
        restangularItem.start_time = range.start.format("HH:mm");
        restangularItem.end_time = range.end.format("HH:mm");
        var currentByWeekDay = _.cloneDeep(_this.byWeekDay);
        restangularItem.save().then(function (resp) {
          _this.byWeekDayBackup = currentByWeekDay;
        }).catch(function (error) {
          _this.byWeekDay[range.weekday] = _.cloneDeep(_this.byWeekDayBackup[range.weekday]);
          _this.redrawFunctions[range.weekday].setRanges(_this.byWeekDay[range.weekday]);
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
      })();
    } else {

      DataService.getShopWeekWorkingHours(_this.shop.id).post({
        start_time: range.start.format("HH:mm"),
        end_time: range.end.format("HH:mm"),
        weekday: range.weekday
      }).then(function (savedRange) {
        restangularItems[savedRange.id] = savedRange;
        range.id = savedRange.id;
        _this.redrawFunctions[range.weekday].setId(range, range.id);
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };

  this.addNewRange = function (range, extraArgs) {
    var day = extraArgs.day;

    var newRange = {
      weekday: day,
      start: range.start,
      end: range.start.clone().add(1, 'hour')
    };

    _this.byWeekDay[day].push(newRange);
    _this.redrawFunctions[day].setRanges(_this.byWeekDay[day]);
  };

  this.toggleEdit = function () {
    var _this2 = this;

    this.readOnly = !this.readOnly;
    _.each(this.redrawFunctions, function (it) {
      it.setReadonly(_this2.readOnly);
    });
  };

  this.onDoubleTap = function (el, r, idx) {
    var day = r.weekday;

    var confirmPopup = $ionicPopup.confirm({
      title: 'Rimuovi intervallo',
      template: _this.weekDaysNames[r.weekday] + ' dalle ' + r.start.format("HH:mm") + ' alle ' + r.end.format("HH:mm")
    });
    confirmPopup.then(function (res) {
      if (res) {
        var candidate = _this.byWeekDay[day][idx];
        if (!candidate.id) {
          _this.byWeekDay[day].splice(idx, 1);
          _this.redrawFunctions[day].setRanges(_this.byWeekDay[day]);
          return;
        }

        DataService.getShopWeekWorkingHours(_this.shop.id).one(candidate.id).remove().then(function () {
          _this.byWeekDay[day].splice(idx, 1);
          _this.redrawFunctions[day].setRanges(_this.byWeekDay[day]);
        }).catch(function (error) {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
      } else {
        console.log('You are not sure');
      }
    });
  };
}