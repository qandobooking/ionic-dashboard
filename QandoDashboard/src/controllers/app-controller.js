angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, PermissionStore, DataService, $auth, $rootScope, Entities) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();
  this.user = () => Entities.getUser();

  this.logout = function(){
    $auth.logout()
    PermissionStore.clearStore();
    $rootScope.$broadcast("app:logoutSuccess");
   
  };


  
}


