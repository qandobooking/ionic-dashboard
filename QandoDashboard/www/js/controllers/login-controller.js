'use strict';

angular.module('app').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($auth, $rootScope) {
    var _this = this;

    this.credentials = { email: 'bianchimro@gmail.com', password: 'admin123' };
    this.login = function () {
        $auth.login(_this.credentials).then(function (response) {
            // Redirect user here after a successful log in.
            $rootScope.$broadcast("app:loginSuccess", response);
            console.log("login success", response);
        }).catch(function (response) {
            // Handle errors here, such as displaying a notification
            // for invalid email and/or password.
            $rootScope.$broadcast("app:loginError", response);
            console.error("login error", response);
        });
    };
}