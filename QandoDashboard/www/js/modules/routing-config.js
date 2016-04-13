'use strict';

(function () {

  "use strict";

  angular.module('app.routing', ['ionic', 'satellizer']).run(function ($rootScope, $state, $ionicHistory, Preferences, $auth) {

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
      $state.go("app.logged.home");
    }

    /*
    function userLogged(){
        
        $ionicHistory.nextViewOptions({
            historyRoot : true,
            disableBack : true
        })
        if($rootScope.lastDeniedState){
             $state.go($rootScope.lastDeniedState.name, 
                $rootScope.lastDeniedStateParams);
             $rootScope.lastDeniedState = null;
            $rootScope.lastDeniedStateParams = null;
            $rootScope.lastDeniedStateOptions = null;
        } else {
          $state.go("app.logged.home")
        }
    }
     function setLastDeniedState(toState, toParams, options){
        $rootScope.lastDeniedState = toState;
        $rootScope.lastDeniedStateParams = toParams;
        $rootScope.lastDeniedStateOptions = options;
    };
    */

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams, options) {
      console.log($auth.isAuthenticated());
      if (toState.data) {
        if (toState.data.auth && !$auth.isAuthenticated()) {
          event.preventDefault();
          $state.go("app.login");
          return;
        }

        if (toState.data.guest && $auth.isAuthenticated()) {
          event.preventDefault();
          $state.go("app.logged.home");
          return;
        }

        if (toState.data.requiresShop && !Preferences.getCurrentShopId()) {
          event.preventDefault();
          $state.go("app.logged.choose-shop");
          return;
        }
      }
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

    $stateProvider.state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/app.html',
      controller: 'AppCtrl as AppCtrl'
    }).state('app.login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl as LoginCtrl',
      data: {
        guest: true
      }
    }).state('app.logged', {
      url: '/logged',
      templateUrl: 'templates/menu.html',
      data: {
        auth: true
      }
    }).state('app.logged.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html'
        }
      },
      data: {
        requiresShop: true
      }
    }).state('app.logged.choose-shop', {
      url: '/choose-shop',
      views: {
        'menuContent': {
          templateUrl: 'templates/choose-shop.html',
          controller: 'ChooseShopCtrl as ChooseShopCtrl'
        }
      }
    }).state('app.logged.shop', {
      url: '/shop',
      views: {
        'menuContent': {
          templateUrl: 'templates/shop.html',
          controller: 'ShopCtrl as ShopCtrl'
        }
      },
      data: {
        requiresShop: true
      }
    }).state('app.logged.shop-weekhours', {
      url: '/shop-weekhours',
      views: {
        'menuContent': {
          templateUrl: 'templates/shop-weekhours.html',
          controller: 'ShopWeekHoursCtrl as ShopWeekHoursCtrl'
        }
      },
      data: {
        requiresShop: true
      }
    }).state('app.logged.shop-specialhours', {
      url: '/shop-specialhours',
      views: {
        'menuContent': {
          templateUrl: 'templates/shop-specialhours.html',
          controller: 'ShopSpecialHoursCtrl as ShopSpecialHoursCtrl'
        }
      },
      data: {
        requiresShop: true
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector) {
      var $state = $injector.get('$state');
      $state.go('app.logged.home');
    });
  });
})();