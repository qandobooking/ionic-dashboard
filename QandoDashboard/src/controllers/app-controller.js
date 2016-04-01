angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();
  this.user = () => Entities.getUser();

  this.logout = function(){
    $auth.logout()
    $rootScope.$broadcast("app:logoutSuccess");
   
  };


  
}


