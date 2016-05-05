'use strict';

angular.module('app').controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities, Preferences, HttpUtils, $state) {
  var _this = this;

  this.something = "Hello world";
  this.logged = function () {
    return $auth.isAuthenticated();
  };
  $rootScope.entitiesBootstrapError = null;

  $rootScope.$on('Entities:shopChanged', function (evt, shop) {
    _this.shop = shop;
  });

  $rootScope.$on('Entities:userChanged', function (evt, user) {
    _this.user = user;
  });

  $rootScope.$on('Entities:loadUserError', function (evt, error) {
    $rootScope.entitiesBootstrapError = HttpUtils.makeErrorMessage(error);
  });

  $rootScope.$on('Entities:loadShopError', function (evt, error) {
    $rootScope.entitiesBootstrapError = HttpUtils.makeErrorMessage(error);
  });

  $rootScope.$on('Entities:invalidShop', function (evt, error) {
    Preferences.clearPreferences();
  });

  $rootScope.$on('unauthorized', function (evt, error) {
    $auth.logout();
    Preferences.clearPreferences();
  });

  $rootScope.$on('Entities:bootstrapStart', function (evt) {
    $rootScope.entitiesBootstrapError = null;
  });

  this.retryBootstrap = function () {
    return Entities.bootstrap();
  };

  this.logout = function () {
    $auth.logout();
    Preferences.clearPreferences();
    $rootScope.$broadcast("app:logoutSuccess");
  };
}