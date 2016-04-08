angular.module('app')
.controller('ShopCtrl', ShopCtrl);

function ShopCtrl ($scope, Preferences, $state, $ionicHistory, DataService, Entities, TimeUtils, $ionicPopup, $timeout) {

  var restangularItems;
  this.weekDays = TimeUtils.getWeekDays();
  this.weekDaysNames = TimeUtils.getWeekDaysNames();
  this.readOnly = true;
  this.redrawFunctions = {};

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


  this.onRangeUpdate = (range) => {
    const restangularItem = restangularItems[range.id];
    if(range.id){
        restangularItem.start_time = range.start.format("HH:mm");
        restangularItem.end_time = range.end.format("HH:mm");
        console.log(restangularItem.start_time);
        console.log(restangularItem.end_time);
        restangularItem.save();
    } else {

        
        DataService.getShopWeekWorkingHours(this.shop.id)
        .post({
            start_time : range.start.format("HH:mm"),
            end_time : range.end.format("HH:mm"),
            weekday : range.weekday
        })
        .then(savedRange=>{
            restangularItems[savedRange.id] = savedRange;
            range.id = savedRange.id;

        })
    }

  }

  this.addToDay = function(day){
    this.byWeekDay[day].push({
        weekday:day,
        start:moment({hour:0}),
        end:moment({hour:1}),
    })

  }

  this.toggleEdit = function(){
    this.readOnly = !this.readOnly;    
    _.each(this.redrawFunctions, it => {
        it.setReadonly(this.readOnly);   
    })
  }

  
  this.onDoubleTap = function(el){
    var confirmPopup = $ionicPopup.confirm({
     title: 'Consume Ice Cream',
     template: 'Are you sure you want to eat this ice cream?'
   });
    confirmPopup.then(function(res) {
     if(res) {
       console.log('You are sure');
     } else {
       console.log('You are not sure');
     }
   });
  }

  
  
}


