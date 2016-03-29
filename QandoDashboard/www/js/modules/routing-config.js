'use strict';

(function () {

  "use strict";

  angular.module('app.routing', ['ionic']).run(function ($rootScope, $state, $ionicHistory) {

    //perform redirects based on login/logout here

    $rootScope.$on("app:logoutSuccess", function () {
      $state.go("app.login");
    });

    $rootScope.$on("app:loginSuccess", userLogged);

    function userLogged() {

      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
      });
      if ($rootScope.lastDeniedState) {

        $state.go($rootScope.lastDeniedState.name, $rootScope.lastDeniedStateParams);

        $rootScope.lastDeniedState = null;
        $rootScope.lastDeniedStateParams = null;
        $rootScope.lastDeniedStateOptions = null;
      } else {
        $state.go("app.logged.home");
      }
    }

    $rootScope.$on('$stateChangePermissionDenied', function (event, toState, toParams, options) {
      $rootScope.lastDeniedState = toState;
      $rootScope.lastDeniedStateParams = toParams;
      $rootScope.lastDeniedStateOptions = options;
    });

    /*
     $rootScope.$on("$stateChangeSuccess", function(evt, toState, toParams){
        $rootScope.currentState = toState;
        $rootScope.currentStateParams = toParams;
    });
     $rootScope.$on('$stateChangePermissionDenied', 
        function(event, toState, toParams, options) { 
            $rootScope.lastDeniedState = toState;
            $rootScope.lastDeniedStateParams = toParams;
            $rootScope.lastDeniedStateOptions = options;
    });
     $rootScope.shouldLeftSideMenuBeEnabled = function () {
        var deniedMenu = ['app.login'];
        return deniedMenu.indexOf($state.current.name) === -1;
    };
    */
  }).config(function ($stateProvider, $urlRouterProvider) {

    var loggedAndWithShop = function loggedAndWithShop() {
      return {
        only: ['logged', 'hasCurrentShop'],
        redirectTo: function redirectTo() {
          //alert(1)
          //console.log("aa", arguments)
          return "app.login";
        }
      };
    };

    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      template: '<div ui-view></div>',
      controller: 'AppCtrl as AppCtrl'
    }).state('app.login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as LoginCtrl',
      data: {
        permissions: {
          except: ['logged'],
          redirectTo: 'app.logged.home'
        }
      }
    }).state('app.logged', {
      url: '/logged',
      templateUrl: 'templates/menu.html',
      data: {
        permissions: {
          only: ['logged'],
          redirectTo: 'app.login'
        }
      }
    }).state('app.logged.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      },
      data: {
        permissions: {
          only: ['hasCurrentShop'],
          redirectTo: 'app.logged.choose-shop'
        }
      }
    }).state('app.logged.choose-shop', {
      url: '/choose-shop',
      views: {
        'menuContent': {
          templateUrl: 'templates/choose-shop.html',
          controller: 'ChooseShopCtrl as ChooseShopCtrl'
        }
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector) {
      var $state = $injector.get('$state');
      $state.go('app.logged.home');
    });
  });
})();