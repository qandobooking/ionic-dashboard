angular.module('app')
.controller('ShopSpecialHoursCtrl', ShopSpecialHoursCtrl);

function ShopSpecialHoursCtrl ($scope, DataService, Entities, $ionicModal, $ionicPopup, initialLoaderManager, notifyManager, HttpUtils) {

  let restangularItems = {};

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop().then(s => {
      this.shop = s;
      return DataService
      .getShopSpecialWeekWorkingHours(s.id)
      .getList({'date__gte':moment().format('YYYY-MM-DD')})
      .then(response => {
        const asMoments = response.map(item => {
          restangularItems[item.id] = item;
          return {
            start: moment(item.start_time, "HH:mm"),
            end: moment(item.end_time, "HH:mm"),
            id: item.id,
            date: item.date,
          };
        });
        const byMonth = _.groupBy(asMoments, ({date}) => moment(date).format("MMMM YYYY"));
        this.byMonthAndDate = _.mapValues(byMonth, swhs =>  _.groupBy(swhs, 'date'));
      });
    })
  ));

  // Date for add new special hours
  this.modalDate = null;

  // Open modal on date when date picker value change
  $scope.$watch('ShopSpecialHoursCtrl.modalDate', (nv, ov) => {
    if (nv) {
      const dt = moment(this.modalDate);
      const yearmonth = dt.format("MMMM YYYY");
      const day = dt.format("YYYY-MM-DD")

      if (!this.byMonthAndDate[yearmonth]) {
        this.byMonthAndDate[yearmonth] = {}
      }

      if (!this.byMonthAndDate[yearmonth][day]) {
        this.byMonthAndDate[yearmonth][day] = [];
      }

      this.openModal(day, this.byMonthAndDate[yearmonth][day]);
    }
  });

  // Open the modal set day and ranges to scope and redraw ranges
  this.openModal = function(day, ranges){
    $scope.day = day;
    $scope.ranges = ranges;
    this.modal.show().then(() => {
      $scope.g.redrawFunction.setRanges(ranges);
    });
  };

  // Modal for edit special hours
  $ionicModal.fromTemplateUrl('templates/specialhours-modal.html', {
    scope : $scope
  }).then(modal => {
    this.modal = modal;
  });

  // Remove modal when controlle dead
  $scope.$on('$destroy', () => {
    this.modal.remove();
  });

  $scope.$on('modal.hidden',() => {
    // When modal hidden clean up current ranges
    if ($scope.g){
      $scope.g.redrawFunction.setRanges([]);
    }

    const day = $scope.day;
    const yearmonth = moment(day).format("MMMM YYYY");

    // Remove unsaved ranges
    this.byMonthAndDate[yearmonth][day] = _.filter(this.byMonthAndDate[yearmonth][day], ({id}) => id);

    // When modal hidden remove the keys with no data previously added
    // on modal creation
    if (!this.byMonthAndDate[yearmonth][day].length){
      delete this.byMonthAndDate[yearmonth][day];
    }
    if (!_.keys(this.byMonthAndDate[yearmonth]).length){
      delete this.byMonthAndDate[yearmonth];
    }
  });

  $scope.g = {};

  $scope.hideModal = () => {
    this.modal.hide()
  };

  // New range in current time table
  $scope.addNewRange = (range, extraArgs) => {
    const day = $scope.day;
    const newRange = {
        date: day,
        start: range.start,
        end: range.start.clone().add(1, 'hour'),
    };
    const intervalSelector = $scope.g.redrawFunction;
    const ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector.setRanges(ranges);
  };

  $scope.onRangeUpdate = range => {
    if (range.id) {
      // Update existing range
      const r = restangularItems[range.id]
      r.start_time = range.start.format("HH:mm");
      r.end_time = range.end.format("HH:mm");

      r.save()
      .then((savedRange)=> {
        // ...
      })
      .catch((error) => {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    } else {
      // Create new range
      DataService.getShopSpecialWeekWorkingHours(this.shop.id)
        .post({
          start_time: range.start.format("HH:mm"),
          end_time:  range.end.format("HH:mm"),
          date: range.date
        })
        .then(savedRange => {
          // Store restangular item for server operation
          restangularItems[savedRange.id] = savedRange;
          // Update instance for D3
          range.id = savedRange.id;
          $scope.g.redrawFunction.setId(range, range.id);
          //addRangeToController(savedRange);
        })
        .catch((error) => {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
    }
  };

  $scope.onDoubleTap = (element, range, index) => {
    const date = range.date;

    const confirmPopup = $ionicPopup.confirm({
      title: 'Rimuovi intervallo',
      template: `${moment(date).format("DD MMMM YYYY")} dalle ${range.start.format("HH:mm")} alle ${range.end.format("HH:mm")} ${range.id}`
    });
    confirmPopup.then(res => {
      if (res) {
        restangularItems[range.id].remove()
        .then(() => {
          // Remove from restangular itmes
          delete restangularItems[range.id];

          // Remove from ranges
          const intervalSelector = $scope.g.redrawFunction;
          const ranges = intervalSelector.getRanges();
          ranges.splice(index, 1);
          $scope.g.redrawFunction.setRanges(ranges);
        })
        .catch((error) => {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
      }
    });
  };
}
