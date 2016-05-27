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

  // When modal hidden clean up ranges
  $scope.$on('modal.hidden',() => {
    if ($scope.g){
      $scope.g.redrawFunction.setRanges([]);
    }
  });

  $scope.g = {};

  $scope.hideModal = () => {
    this.modal.hide()
  };














  var addRangeToController = savedRange => {

    const mom = moment(savedRange.date);
    const yearmonth = mom.format("MMMM YYYY");
    const day = mom.format('YYYY-MM-DD');
    let o = {
      start : moment(savedRange.start_time, "HH:mm"),
      end : moment(savedRange.end_time, "HH:mm"),
      id : savedRange.id,
      date : savedRange.date,
    }
    if (!this.byMonthAndDate[yearmonth]){
      this.byMonthAndDate[yearmonth] = {};
    }
    if (!this.byMonthAndDate[yearmonth][day]){
      this.byMonthAndDate[yearmonth][day] = [];
      this.byMonthAndDate[yearmonth][day].push(o);
    }



  }

  $scope.onRangeUpdate = range => {
    //$scope.$apply() allows to see the change in template under the modal
    $scope.$apply();
    if(range.id){
      let r = restangularItems[range.id]
      r.start_time = range.start.format("HH:mm");
      r.end_time = range.end.format("HH:mm");

      r.save()
      .then((savedRange)=>{

      })
      .catch((error) => {

        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });

    } else {
      DataService.getShopSpecialWeekWorkingHours(this.shop.id)
        .post({
            start_time : range.start.format("HH:mm"),
            end_time : range.end.format("HH:mm"),
            date : range.date
        })
        .then(savedRange =>{
            restangularItems[savedRange.id] = savedRange;
            range.id = savedRange.id;
            $scope.g.redrawFunction
            .setId(range, range.id);
            addRangeToController(savedRange);

        })
        .catch((error) => {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        });
    }
  }

  $scope.onDoubleTap = (el,  r, idx) => {
    var date = r.date;

    var confirmPopup = $ionicPopup.confirm({
     title: 'Rimuovi intervallo',
     template: `${moment(date).format("DD MMMM YYYY")} dalle ${r.start.format("HH:mm")} alle ${r.end.format("HH:mm")} ${r.id}`
   });
    confirmPopup.then(res => {

     if(res) {

       restangularItems[r.id].remove()
       .then(()=>{
        const yearmonth = moment(r.date).format("MMMM YYYY");
        let arr = this.byMonthAndDate[yearmonth][r.date];
        let idx = _.findIndex(arr, {'id' : r.id })
        this.byMonthAndDate[yearmonth][r.date].splice(idx, 1);

        //if (!this.byMonthAndDate[yearmonth][r.date].length){
          //delete this.byMonthAndDate[yearmonth][r.date];
        //}
        //if (! _.keys(this.byMonthAndDate[yearmonth]).length){
          //delete this.byMonthAndDate[yearmonth];
        //}


        $scope.g.redrawFunction
        .setRanges(this.byMonthAndDate[yearmonth]);

       })
       .catch((error) => {

          notifyManager.error(HttpUtils.makeErrorMessage(error));
       });


     } else {
       console.log('You are not sure');
     }
   });
  }


  $scope.addToDay = function(day){
    var newRange = {
        date:day,
        start:moment({hour:0}),
        end:moment({hour:1}),
    }
    //const yearmonth = moment(day).format("MMMM YYYY");
    const intervalSelector = $scope.g.redrawFunction;
    let ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector
    .setRanges(ranges);
  }

  $scope.addNewRange = (range, extraArgs) => {
    const day = _.clone($scope.day);
    var newRange = {
        date:day,
        start:range.start,
        end:range.start.clone().add(1, 'hour'),
    };
    const intervalSelector = $scope.g.redrawFunction;
    let ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector
    .setRanges(ranges);
  }

}
