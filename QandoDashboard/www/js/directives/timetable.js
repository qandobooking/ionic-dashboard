'use strict';

angular.module('app').directive('timeTable', timeTable);

function timeTable() {
    return {
        restrict: 'A',
        scope: { ranges: "=", onUpdate: "=" },
        link: function link(scope, iElement, iAttrs) {

            var el = iElement[0];
            timeTableIt(el, { ranges: scope.ranges, onUpdate: scope.onUpdate });
        }
    };
}