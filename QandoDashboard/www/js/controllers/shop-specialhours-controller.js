'use strict';

angular.module('app').controller('ShopSpecialHoursCtrl', ShopSpecialHoursCtrl);

function ShopSpecialHoursCtrl($scope, DataService, Entities, $ionicModal, $timeout, $ionicPopup) {
  var _this = this;

  var restangularItems = {};

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getShopSpecialWeekWorkingHours(s.id).getList({ 'date__gte': moment().format('YYYY-MM-DD') }).then(function (response) {

      var asMoments = response.map(function (item) {
        restangularItems[item.id] = item;

        return {
          start: moment(item.start_time, "HH:mm"),
          end: moment(item.end_time, "HH:mm"),
          id: item.id,
          date: item.date
        };
      });
      var byMonth = _.groupBy(asMoments, function (_ref) {
        var date = _ref.date;
        return moment(date).format("MMMM YYYY");
      });
      _this.byMonthAndDate = _.mapValues(byMonth, function (swhs) {
        return _.groupBy(swhs, 'date');
      });
    });
  });

  $scope.g = {};

  $ionicModal.fromTemplateUrl('templates/specialhours-modal.html', {
    scope: $scope
  }).then(function (modal) {
    _this.modal = modal;
  });

  var addRangeToController = function addRangeToController(savedRange) {

    var mom = moment(savedRange.date);
    var yearmonth = mom.format("MMMM YYYY");
    var day = mom.format('YYYY-MM-DD');
    var o = {
      start: moment(savedRange.start_time, "HH:mm"),
      end: moment(savedRange.end_time, "HH:mm"),
      id: savedRange.id,
      date: savedRange.date
    };
    if (!_this.byMonthAndDate[yearmonth]) {
      _this.byMonthAndDate[yearmonth] = {};
    }
    if (!_this.byMonthAndDate[yearmonth][day]) {
      _this.byMonthAndDate[yearmonth][day] = [];
      _this.byMonthAndDate[yearmonth][day].push(o);
    }
  };

  $scope.onRangeUpdate = function (range) {

    //$scope.$apply() allows to see the change in template under the modal
    $scope.$apply();
    if (range.id) {
      var r = restangularItems[range.id];
      r.start_time = range.start.format("HH:mm");
      r.end_time = range.end.format("HH:mm");

      r.save().then(function (savedRange) {});
    } else {
      DataService.getShopSpecialWeekWorkingHours(_this.shop.id).post({
        start_time: range.start.format("HH:mm"),
        end_time: range.end.format("HH:mm"),
        date: range.date
      }).then(function (savedRange) {
        restangularItems[savedRange.id] = savedRange;
        range.id = savedRange.id;
        $scope.g.redrawFunction.setId(range, range.id);
        addRangeToController(savedRange);
      });
    }
  };

  $scope.onDoubleTap = function (el, r, idx) {
    var date = r.date;

    var confirmPopup = $ionicPopup.confirm({
      title: 'Rimuovi intervallo',
      template: moment(date).format("DD MMMM YYYY") + ' dalle ' + r.start.format("HH:mm") + ' alle ' + r.end.format("HH:mm")
    });
    confirmPopup.then(function (res) {

      if (res) {

        restangularItems[r.id].remove().then(function () {
          var yearmonth = moment(r.date).format("MMMM YYYY");
          var arr = _this.byMonthAndDate[yearmonth][r.date];
          var idx = _.findIndex(arr, { 'id': r.id });
          _this.byMonthAndDate[yearmonth][r.date].splice(idx, 1);

          if (!_this.byMonthAndDate[yearmonth][r.date].length) {
            delete _this.byMonthAndDate[yearmonth][r.date];
          }
          if (!_.keys(_this.byMonthAndDate[yearmonth]).length) {
            delete _this.byMonthAndDate[yearmonth];
          }

          $scope.g.redrawFunction.setRanges((_this.byMonthAndDate[yearmonth] || {})[r.date] || []);
        });
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.$on('modal.hidden', function () {
    if ($scope.g) {
      $scope.g.redrawFunction.setRanges([]);
    }
  });

  this.openModal = function (day, ranges) {
    $scope.day = day;
    $scope.ranges = ranges;
    $scope.backupRanges = angular.copy(ranges);
    this.modal.show().then(function () {
      $scope.g.redrawFunction.setRanges(ranges);
    });
  };

  this.modalDate = null;
  this.openDate = function () {
    var dt = moment(_this.modalDate);
    var yearmonth = dt.format("MMMM YYYY");
    var day = dt.format("YYYY-MM-DD");
    if (!_this.byMonthAndDate[yearmonth]) {
      _this.byMonthAndDate[yearmonth] = {};
    }

    var ranges = [];
    if (_this.byMonthAndDate[yearmonth] && _this.byMonthAndDate[yearmonth][day]) {
      ranges = _this.byMonthAndDate[yearmonth][day];
    }
    _this.openModal(day, ranges);
  };

  $scope.hideModal = function () {
    _this.modal.hide();
  };

  //#TODO: this does not work as we don't save the ranges after restoring them
  /*
  $scope.cancelEdit = () => {
    let dt = moment($scope.day);
    const yearmonth = dt.format("MMMM YYYY");
    console.log(1, $scope.day, $scope.backupRanges);
    this.byMonthAndDate[yearmonth][$scope.day] = $scope.backupRanges;
    this.modal.hide()
  }
  */

  $scope.$on('$destroy', function () {
    this.modal.remove();
  });

  $scope.addToDay = function (day) {
    var newRange = {
      date: day,
      start: moment({ hour: 0 }),
      end: moment({ hour: 1 })
    };
    var yearmonth = moment(day).format("MMMM YYYY");
    var intervalSelector = $scope.g.redrawFunction;
    var ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector.setRanges(ranges);
  };
}