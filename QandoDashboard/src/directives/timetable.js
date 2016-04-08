angular.module('app')
.directive('timeTable', timeTable);


function timeTable() {
    return {
        restrict: 'A',
        scope : { ranges : "=", onUpdate : "=", onDoubleTap : "=",  redraw:"="},
        link: function (scope, iElement, iAttrs) {
            
            var el = iElement[0];
            /*
            scope.$watchCollection('ranges', function(nv, ov){
                if(!ov){
                    return;
                }
                update()
            })

            scope.$watch('readOnly', function(nv, ov){
                if(ov === undefined){
                    return;
                }
                update()
            })
            */
            
            scope.redraw = null;
            function update(){
                scope.redraw = timeTableIt(el, { ranges : scope.ranges, onUpdate : scope.onUpdate,
                onDoubleTap : scope.onDoubleTap, readOnly : scope.$eval(iAttrs.readOnly) });    
            }

            update();
            

        }
    };
}