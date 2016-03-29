
angular
.module('app.permissions', ['permission', 'satellizer'])
.run(function (PermissionStore, RoleStore, Preferences, $auth) {
  // Define anonymous permission
  
  PermissionStore
    .definePermission('hasCurrentShop', function (stateParams) {
      console.log("check hasCurrentShop")
      var currentShopId = Preferences.getCurrentShopId()
      if (!currentShopId) {
        return false; 
      }
      return true;
    });

  PermissionStore
    .definePermission('logged', function (stateParams) {
      console.log("loggeed check", $auth.isAuthenticated())
      if ($auth.isAuthenticated()) {
        return true; 
      }
      return false;
    });

  



});