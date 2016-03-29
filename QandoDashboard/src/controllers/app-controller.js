angular.module('app')
.controller('AppCtrl', AppCtrl);

function AppCtrl ($scope, $ionicModal, $timeout, PermissionStore, DataService, $auth, $rootScope) {

  this.something = "Hello world";
  this.logged = () => $auth.isAuthenticated();

  const getRemoteUser = () => {
      DataService.me
      .get()
      .then(user => {
          console.log(1, user)
          this.user = user;
      })
  }

  //handles login signal and gets user
  $scope.$on("app:loginSuccess",  getRemoteUser);
  //$scope.$on("app:isAlreadyLogged",  getRemoteUser);
  if(this.logged()){
    getRemoteUser();
  }

  this.logout = function(){
      $auth.logout()
      PermissionStore.clearStore();
      this.user = null;
      $rootScope.$broadcast("app:logoutSuccess");
   
  };


  
}


