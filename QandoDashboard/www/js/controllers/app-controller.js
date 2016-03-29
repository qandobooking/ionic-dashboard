'use strict';

angular.module('app').controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $ionicModal, $timeout, PermissionStore, DataService, $auth, $rootScope, Entities) {

  this.something = "Hello world";
  this.logged = function () {
    return $auth.isAuthenticated();
  };
  this.user = function () {
    return Entities.getUser();
  };

  this.logout = function () {
    $auth.logout();
    PermissionStore.clearStore();
    $rootScope.$broadcast("app:logoutSuccess");
  };
}