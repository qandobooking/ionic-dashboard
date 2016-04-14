angular.module('app')
.controller('ShopClosingDaysCtrl', ShopClosingDaysCtrl);

function ShopClosingDaysCtrl () {

  this.closingDays = [
    moment('0004-09-29')
  ];

  this.onDayToggled = function (d, selected) {
    console.log(d.format());
    console.log(selected);
  };
}


