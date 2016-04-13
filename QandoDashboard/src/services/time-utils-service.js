(function(){
"use strict";

angular.module("app")
.factory('TimeUtils', TimeUtils);

function TimeUtils(){
    var svc = {}

    const weekDays = [0,1,2,3,4,5,6];
    svc.getWeekDays = function(){
        return weekDays;
    }
    
    svc.getWeekDaysNames = function(){
        var wdays = moment.weekdays()
        wdays.push(wdays.shift())
        return wdays;
    }

    svc.getMonthsByName = function(){
        return moment.months()
    }

    return svc;    
}



})();