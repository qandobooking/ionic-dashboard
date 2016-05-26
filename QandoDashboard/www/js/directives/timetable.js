'use strict';

angular.module('app').directive('timeTable', timeTable);

function timeTable($window) {
    return {
        restrict: 'A',
        scope: { ranges: "=", onUpdate: "=", onDoubleTap: "=",
            redraw: "=", onEmptyClick: "=", extraArgs: "=" },
        link: function link(scope, iElement, iAttrs) {

            var el = iElement[0];

            scope.redraw = null;

            function update() {
                scope.redraw = timeTableIt(el, { ranges: scope.ranges, onUpdate: scope.onUpdate,
                    onDoubleTap: scope.onDoubleTap,
                    readOnly: scope.$eval(iAttrs.readOnly),
                    onEmptyClick: scope.onEmptyClick,
                    extraArgs: scope.extraArgs
                });
            }

            //redraw on window resize
            angular.element($window).bind('resize', function () {
                scope.redraw.redraw();
            });

            update();
        }
    };
}