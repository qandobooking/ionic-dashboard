angular.module('app')
.directive('timeTable', timeTable);


function timeTable() {
    return {
        restrict: 'A',
        scope : { ranges : "="},
        link: function (scope, iElement, iAttrs) {
            
            
            var el = iElement[0];
            timeTableIt(el, { ranges : scope.ranges })




            
        }
    };
}