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

  $scope.$on('modal.hidden', function () {
    // When modal hidden clean up current ranges
    if ($scope.g) {
      $scope.g.redrawFunction.setRanges([]);
    }

    var day = $scope.day;
    var yearmonth = moment(day).format("MMMM YYYY");

    // Remove unsaved ranges
    _this.byMonthAndDate[yearmonth][day] = _.filter(_this.byMonthAndDate[yearmonth][day], function (_ref2) {
      var id = _ref2.id;
      return id;
    });

    // When modal hidden remove the keys with no data previously added
    // on modal creation
    if (!_this.byMonthAndDate[yearmonth][day].length) {
      delete _this.byMonthAndDate[yearmonth][day];
    }
    if (!_.keys(_this.byMonthAndDate[yearmonth]).length) {
      delete _this.byMonthAndDate[yearmonth];
    }
  });

  $scope.g = {};

  $scope.hideModal = function () {
    _this.modal.hide();
  };

  // New range in current time table
  $scope.addNewRange = function (range, extraArgs) {
    var day = $scope.day;
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

  $scope.onRangeUpdate = function (range) {
    if (range.id) {
      // Update existing range
      var r = restangularItems[range.id];
      r.start_time = range.start.format("HH:mm");
      r.end_time = range.end.format("HH:mm");

      r.save().then(function (savedRange) {
        // ...
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    } else {
      // Create new range
      DataService.getShopSpecialWeekWorkingHours(_this.shop.id).post({
        start_time: range.start.format("HH:mm"),
        end_time: range.end.format("HH:mm"),
        date: range.date
      }).then(function (savedRange) {
        // Store restangular item for server operation
        restangularItems[savedRange.id] = savedRange;
        // Update instance for D3
        range.id = savedRange.id;
        $scope.g.redrawFunction.setId(range, range.id);
        //addRangeToController(savedRange);
      }).catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };

  $scope.onDoubleTap = function (element, range, index) {
    var date = range.date;

    var confirmPopup = $ionicPopup.confirm({
      title: 'Rimuovi intervallo',
      template: moment(date).format("DD MMMM YYYY") + ' dalle ' + range.start.format("HH:mm") + ' alle ' + range.end.format("HH:mm") + ' ' + range.id
    });
    confirmPopup.then(function (res) {
      if (res) {
        restangularItems[range.id].remove().then(function () {
          // Remove from restangular itmes
          delete restangularItems[range.id];

          // Remove from ranges
          var intervalSelector = $scope.g.redrawFunction;
          var ranges = intervalSelector.getRanges();
          ranges.splice(index, 1);
          $scope.g.redrawFunction.setRanges(ranges);
        }).catch(function (error) {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
      }
    });
  };
}