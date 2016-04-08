angular.module('app')
.controller('ShopCtrl', ShopCtrl);

function ShopCtrl (Preferences, $state, $ionicHistory, DataService, Entities, TimeUtils) {

  var restangularItems;
  this.weekDays = TimeUtils.getWeekDays();
  this.weekDaysNames = TimeUtils.getWeekDaysNames();

  Entities
  .getShop().then(s => { 
    this.shop=s; 
    DataService.getShopWeekWorkingHours(s.id)
    .getList()
    .then(weekWorkingHours => {
        
        restangularItems = _.keyBy(weekWorkingHours, 'id');

        const moments = _.map(weekWorkingHours.plain(), w => {
            return {
                id : w.id,
                start : moment(w.start_time, "HH:mm"),
                end : moment(w.end_time, "HH:mm"),
                weekday : w.weekday,
            }
        }) 
        var byWeekDay = _.groupBy(moments, 'weekday')
        _.each(this.weekDays, d => {
            if(!byWeekDay[d]){
                byWeekDay[d] = [];
            }
        })
        this.byWeekDay = byWeekDay;
        
    });

  });


  this.onRangeUpdate = function(range){
    console.log(range);

    const restangularItem = restangularItems[range.id];
    restangularItem.start_time = range.start.format("HH:mm");
    restangularItem.end_time = range.end.format("HH:mm");
    console.log(restangularItem.start_time);
    console.log(restangularItem.end_time);
    restangularItem.save();

  }




  this.testWorkingHours = [
    { start: moment({ hour:0, minute:0 }), end: moment({ hour:12, minute:0 })},
    { start: moment({ hour:13, minute:0 }), end: moment({ hour:24, minute:0 })},
  ]
  
  
}


