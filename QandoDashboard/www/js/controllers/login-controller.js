'use strict';

angular.module('app').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($auth, $rootScope, notifyManager, HttpUtils, $ionicLoading) {
  var _this = this;

  this.credentials = {
    email: null,
    password: null
  };

  // Showing user error
  this.invalidCredentials = false;

  this.login = function () {
    // Show loader and hide the credentials error
    _this.invalidCredentials = false;
    $ionicLoading.show();

    $auth.login(_this.credentials).then(function (response) {
      $rootScope.$broadcast("app:loginSuccess", response);
    }).catch(function (error) {
      if (error.status === 400) {
        _this.invalidCredentials = true;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
      $rootScope.$broadcast("app:loginError", error);
    }).finally(function () {
      $ionicLoading.hide();
    });
  };
}