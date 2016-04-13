'use strict';

angular.module('app').controller('ShopSpecialHoursCtrl', ShopSpecialHoursCtrl);

function ShopSpecialHoursCtrl($scope) {

  var response = [{
    date: '2016-09-26',
    start: '2016-09-26 09:00',
    end: '2016-09-26 09:00'
  }, {
    date: '2016-01-26',
    start: '2016-01-26 09:00',
    end: '2016-01-26 09:00'
  }];

  var byMonth = _.groupBy(response, function (_ref) {
    var date = _ref.date;
    return moment(date).month();
  });
  var byManthAndDate = _.mapValues(byMonth, function (swhs) {
    return _.groupBy(swhs, 'date');
  });

  console.log('-->', byManthAndDate);
  console.log('X');

  //this.byMoth =
}