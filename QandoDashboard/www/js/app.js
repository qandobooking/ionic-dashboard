'use strict';

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'restangular', 'satellizer', 'angular-storage', 'validate-form', 'app.constants', 'app.satellizer', 'app.routing', 'app.network', 'ion-datetime-picker', 'initial-loader', 'notify']).run(function ($ionicPlatform, $rootScope, Entities) {

  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Entities.bootstrap();
  });
}).config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider, $logProvider, $compileProvider, validateFormProvider) {
  //$logProvider.debugEnabled(false);
  //$compileProvider.debugInfoEnabled(false);
  console.log(validateFormProvider);
  validateFormProvider.setOptions({
    errorsTemplateUrl: 'templates/default-forms-errors.html',
    serverErrorsTemplateUrl: 'templates/server-errors.html'
  });
  $ionicConfigProvider.views.swipeBackEnabled(false);
  //const tpl = <div class="form-error" ng-message="required">Il campo è richiesto</div>
});