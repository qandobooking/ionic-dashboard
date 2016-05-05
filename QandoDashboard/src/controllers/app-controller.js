angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities, Preferences, HttpUtils, $state) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();
  $rootScope.entitiesBootstrapError = null;

  $rootScope.$on('Entities:shopChanged', (evt, shop) => {
    this.shop = shop;
  })

  $rootScope.$on('Entities:userChanged', (evt, user) => {
    this.user = user;
  })

  $rootScope.$on('Entities:loadUserError', (evt, error) => {
    $rootScope.entitiesBootstrapError = HttpUtils.makeErrorMessage(error);
  });

  $rootScope.$on('Entities:loadShopError', (evt, error) => {
    $rootScope.entitiesBootstrapError = HttpUtils.makeErrorMessage(error);
  });

  $rootScope.$on('Entities:invalidShop', (evt, error) => {
    Preferences.clearPreferences();
  });

  $rootScope.$on('unauthorized', (evt, error) => {
    $auth.logout();
    Preferences.clearPreferences();
  });

  $rootScope.$on('Entities:bootstrapStart', (evt) => {
    $rootScope.entitiesBootstrapError = null;
  });

  this.retryBootstrap = () => Entities.bootstrap();

  this.logout = () => {
    $auth.logout();
    Preferences.clearPreferences();
    $rootScope.$broadcast("app:logoutSuccess");
  };
}
