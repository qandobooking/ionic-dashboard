(function(){

"use strict";

angular.module('app.routing', ['ionic'])

.run(function($rootScope, $state, $ionicHistory){

    //perform redirects based on login/logout here
    /*
    $rootScope.$on("app:logoutSuccess", function(){
        $state.go("app.login");
    })

    $rootScope.$on("app:loginSuccess", function(){
        $rootScope.logged = true;
        
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
            $state.go('app.home');
        }
            
        
    });

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

})

.config(function($stateProvider, $urlRouterProvider){

    $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl as AppCtrl',
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
        }
      },
      data: {
        permissions: {
          only: ['hasCurrentShop'],
          redirectTo: 'app.choose-shop',
        }
      }
    })

    .state('app.choose-shop', {
      url: '/choose-shop',
      views: {
        'menuContent': {
          templateUrl: 'templates/choose-shop.html',
          controller : 'ChooseShopCtrl as ChooseShopCtrl',
        }
      }
    })


    
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get('$state');
        $state.go('app.home');
    });

})

})();