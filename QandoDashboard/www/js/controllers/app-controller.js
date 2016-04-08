'use strict';

angular.module('app').controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities, Preferences) {
  var _this = this;

  this.something = "Hello world";
  this.logged = function () {
    return $auth.isAuthenticated();
  };

  $rootScope.$on('Entities:shopChanged', function (evt, shop) {
    _this.shop = shop;
  });

  $rootScope.$on('Entities:userChanged', function (evt, user) {
    _this.user = user;
  });

  this.logout = function () {
    $auth.logout();
    Preferences.clearPreferences();
    $rootScope.$broadcast("app:logoutSuccess");
  };
}