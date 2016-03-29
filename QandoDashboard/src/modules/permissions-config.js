
angular
  .module('app.permissions', ['permission'])
  .run(function (PermissionStore, Preferences) {
    // Define anonymous permission
    PermissionStore
      .definePermission('hasCurrentShop', function (stateParams) {
        var currentShopId = Preferences.getCurrentShopId()
        if (!currentShopId) {
          return false; 
        }
        return true;
      });
  });