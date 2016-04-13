(function() {
  'use strict';

  angular.module('app')
  .filter('momentDateFormat', function(){
    return function(input, format){
        var m = moment(input, "YYYY-MM-DD");
        return m.format(format);
    }
  })
  .filter('momentDateTimeFormat', function(){
    return function(input, format){
        var m = moment(input, "YYYY-MM-DD HH:mm:ss");
        return m.format(format);
    }
  });

})();