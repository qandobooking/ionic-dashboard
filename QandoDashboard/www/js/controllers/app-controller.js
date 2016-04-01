'use strict';

angular.module('app').controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $ionicModal, $timeout, DataService, $auth, $rootScope, Entities) {

  this.something = "Hello world";
  this.logged = function () {
    return $auth.isAuthenticated();
  };
  this.user = function () {
    return Entities.getUser();
  };

  this.logout = function () {
    $auth.logout();
    $rootScope.$broadcast("app:logoutSuccess");
  };
}