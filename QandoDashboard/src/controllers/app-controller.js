angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities, Preferences) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();
  
  $rootScope.$on('Entities:shopChanged', (evt, shop) => {
    this.shop = shop;
  })
  
  $rootScope.$on('Entities:userChanged', (evt, user) => {
    this.user = user;
  })
  
  

  this.logout = function(){
    $auth.logout()
    Preferences.clearPreferences();
    $rootScope.$broadcast("app:logoutSuccess");
  };


  
}


