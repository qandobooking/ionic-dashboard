'use strict';

angular.module('app').controller('ShopSpecialHoursCtrl', ShopSpecialHoursCtrl);

function ShopSpecialHoursCtrl($scope, DataService, Entities, $ionicModal, $ionicPopup, initialLoaderManager, notifyManager, HttpUtils) {
  var _this = this;

  var restangularItems = {};

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getShopSpecialWeekWorkingHours(s.id).getList({ 'date__gte': moment().format('YYYY-MM-DD') }).then(function (response) {
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
  });

  // Date for add new special hours
  this.modalDate = null;

  // Open modal on date when date picker value change
  $scope.$watch('ShopSpecialHoursCtrl.modalDate', function (nv, ov) {
    if (nv) {
      var dt = moment(_this.modalDate);
      var yearmonth = dt.format("MMMM YYYY");
      var day = dt.format("YYYY-MM-DD");

      if (!_this.byMonthAndDate[yearmonth]) {
        _this.byMonthAndDate[yearmonth] = {};
      }

      if (!_this.byMonthAndDate[yearmonth][day]) {
        _this.byMonthAndDate[yearmonth][day] = [];
      }

      _this.openModal(day, _this.byMonthAndDate[yearmonth][day]);
    }
  });

  // Open the modal set day and ranges to scope and redraw ranges
  this.openModal = function (day, ranges) {
    $scope.day = day;
    $scope.ranges = ranges;
    this.modal.show().then(function () {
      $scope.g.redrawFunction.setRanges(ranges);
    });
  };

  // Modal for edit special hours
  $ionicModal.fromTemplateUrl('templates/specialhours-modal.html', {
    scope: $scope
  }).then(function (modal) {
    _this.modal = modal;
  });

  // Remove modal when controlle dead
  $scope.$on('$destroy', function () {
    _this.modal.remove();
  });

  // When modal hidden clean up ranges
  $scope.$on('modal.hidden', function () {
    if ($scope.g) {
      $scope.g.redrawFunction.setRanges([]);
    }
  });

  $scope.g = {};

  $scope.hideModal = function () {
    _this.modal.hide();
  };

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

      r.save().then(function (savedRange) {}).catch(function (error) {

        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
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
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };

  $scope.onDoubleTap = function (el, r, idx) {
    var date = r.date;

    var confirmPopup = $ionicPopup.confirm({
      title: 'Rimuovi intervallo',
      template: moment(date).format("DD MMMM YYYY") + ' dalle ' + r.start.format("HH:mm") + ' alle ' + r.end.format("HH:mm") + ' ' + r.id
    });
    confirmPopup.then(function (res) {

      if (res) {

        restangularItems[r.id].remove().then(function () {
          var yearmonth = moment(r.date).format("MMMM YYYY");
          var arr = _this.byMonthAndDate[yearmonth][r.date];
          var idx = _.findIndex(arr, { 'id': r.id });
          _this.byMonthAndDate[yearmonth][r.date].splice(idx, 1);

          //if (!this.byMonthAndDate[yearmonth][r.date].length){
          //delete this.byMonthAndDate[yearmonth][r.date];
          //}
          //if (! _.keys(this.byMonthAndDate[yearmonth]).length){
          //delete this.byMonthAndDate[yearmonth];
          //}

          $scope.g.redrawFunction.setRanges(_this.byMonthAndDate[yearmonth]);
        }).catch(function (error) {

          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
      } else {
        console.log('You are not sure');
      }
    });
  };

  $scope.addToDay = function (day) {
    var newRange = {
      date: day,
      start: moment({ hour: 0 }),
      end: moment({ hour: 1 })
    };
    //const yearmonth = moment(day).format("MMMM YYYY");
    var intervalSelector = $scope.g.redrawFunction;
    var ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector.setRanges(ranges);
  };

  $scope.addNewRange = function (range, extraArgs) {
    var day = _.clone($scope.day);
    var newRange = {
      date: day,
      start: range.start,
      end: range.start.clone().add(1, 'hour')
    };
    var intervalSelector = $scope.g.redrawFunction;
    var ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector.setRanges(ranges);
  };
}