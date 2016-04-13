angular.module('app')
.controller('ShopSpecialHoursCtrl', ShopSpecialHoursCtrl);

function ShopSpecialHoursCtrl ($scope) {

  const response = [
    {
      date: '2016-09-26',
      start: '2016-09-26 09:00',
      end: '2016-09-26 09:00'
    },
    {
      date: '2016-01-26',
      start: '2016-01-26 09:00',
      end: '2016-01-26 09:00'
    }
  ];

  const byMonth = _.groupBy(response, ({date}) => moment(date).month());
  const byManthAndDate = _.mapValues(byMonth, swhs =>  _.groupBy(swhs, 'date'));

  console.log('-->',byManthAndDate);
  console.log('X');

  //this.byMoth =

}


