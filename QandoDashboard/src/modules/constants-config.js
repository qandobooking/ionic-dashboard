(function(){

"use strict";

angular.module('app.constants', [])

.run(function(){})

.config(function(){})

//.constant('baseServerUrl', "http://localhost:8000/api/manage")
.constant('baseServerUrl', (function(){
    if (window.cordova){
        return "http://api.qando.it/api/manage"      
    }
    return "http://localhost:8000/api/manage";

}()))

.constant('bookingStatusNames', {
  pending: 'In Attesa',
})



})();
