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

  $scope.g = {};

  $ionicModal.fromTemplateUrl('templates/specialhours-modal.html', {
    scope : $scope
  }).then(modal => {
    this.modal = modal;
  })


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
     template: `${moment(date).format("DD MMMM YYYY")} dalle ${r.start.format("HH:mm")} alle ${r.end.format("HH:mm")}`
   });
    confirmPopup.then(res => {

     if(res) {

       restangularItems[r.id].remove()
       .then(()=>{
        const yearmonth = moment(r.date).format("MMMM YYYY");
        let arr = this.byMonthAndDate[yearmonth][r.date];
        let idx = _.findIndex(arr, {'id' : r.id })
        this.byMonthAndDate[yearmonth][r.date].splice(idx, 1);

        if (!this.byMonthAndDate[yearmonth][r.date].length){
          delete this.byMonthAndDate[yearmonth][r.date];
        }
        if (! _.keys(this.byMonthAndDate[yearmonth]).length){
          delete this.byMonthAndDate[yearmonth];
        }


        $scope.g.redrawFunction
        .setRanges((this.byMonthAndDate[yearmonth] || {}) [r.date] || []);

       })
       .catch((error) => {
         notifyManager.error(HttpUtils.makeErrorMessage(error));
       });


     } else {
       console.log('You are not sure');
     }
   });
  }

  $scope.$on('modal.hidden', function() {
    if ( $scope.g ){
      $scope.g.redrawFunction.setRanges([]);
    }
  });

  this.openModal = function(day, ranges){
    $scope.day = day;
    $scope.ranges = ranges;
    $scope.backupRanges = angular.copy(ranges)
    this.modal.show().then(()=>{
      $scope.g.redrawFunction.setRanges(ranges);
    });
  }

  this.modalDate = null;
  this.openDate = () => {
    let dt = moment(this.modalDate);
    const yearmonth = dt.format("MMMM YYYY");
    const day = dt.format("YYYY-MM-DD")
    if(!this.byMonthAndDate[yearmonth]) {
      this.byMonthAndDate[yearmonth] = {}
    }

    let ranges = []
    if(this.byMonthAndDate[yearmonth] && this.byMonthAndDate[yearmonth][day]) {
      ranges = this.byMonthAndDate[yearmonth][day]
    }
    this.openModal(day, ranges);

  }

  $scope.hideModal = () =>{
    this.modal.hide()
  }

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

  $scope.$on('$destroy', () => {
    this.modal.remove();
  });

  $scope.addToDay = function(day){
    var newRange = {
        date:day,
        start:moment({hour:0}),
        end:moment({hour:1}),
    }
    const yearmonth = moment(day).format("MMMM YYYY");
    const intervalSelector = $scope.g.redrawFunction;
    let ranges = intervalSelector.getRanges();
    ranges.push(newRange);
    intervalSelector
    .setRanges(ranges);
  }









}


