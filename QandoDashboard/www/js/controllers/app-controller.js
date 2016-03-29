'use strict';

angular.module('app').controller('AppCtrl', AppCtrl);

function AppCtrl($scope, $ionicModal, $timeout, PermissionStore, DataService, $auth, $rootScope) {
    var _this = this;

    this.something = "Hello world";
    this.logged = function () {
        return $auth.isAuthenticated();
    };

    var getRemoteUser = function getRemoteUser() {
        DataService.me.get().then(function (user) {
            console.log(1, user);
            _this.user = user;
        });
    };

    //handles login signal and gets user
    $scope.$on("app:loginSuccess", getRemoteUser);
    //$scope.$on("app:isAlreadyLogged",  getRemoteUser);
    if (this.logged()) {
        getRemoteUser();
    }

    this.logout = function () {
        $auth.logout();
        PermissionStore.clearStore();
        this.user = null;
        $rootScope.$broadcast("app:logoutSuccess");
    };
}