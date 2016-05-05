angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities, Preferences) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();
  //$rootScope.entitiesBootstrapError = true;
  
  $rootScope.$on('Entities:shopChanged', (evt, shop) => {
    this.shop = shop;
  })
  
  $rootScope.$on('Entities:userChanged', (evt, user) => {
    this.user = user;
  })

  $rootScope.$on('Entities:loadUserError', (evt, error) => {
    $rootScope.entitiesBootstrapError = error;  
    console.error(1, error)
  })

  $rootScope.$on('Entities:loadShopError', (evt, error) => {
    $rootScope.entitiesBootstrapError = error;  
    
  })

  $rootScope.$on('Entities:bootstrapStart', (evt) => {
    $rootScope.entitiesBootstrapError = null;  
  })

  this.retryBootstrap = () => {
    Entities.bootstrap()
  }

  
  

  this.logout = function(){
    $auth.logout()
    Preferences.clearPreferences();
    $rootScope.$broadcast("app:logoutSuccess");
  };


  
}


