angular.module('app')
.controller('ShopEditCtrl', ShopEditCtrl);

function ShopEditCtrl ($scope, Entities, DataService, $state, $ionicLoading, initialLoaderManager, notifyManager, HttpUtils) {

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop().then(s => {
      const shop = s.clone();
      shop.min_booking_time = moment(shop.min_booking_time, 'HH:mm:ss').toDate();
      shop.min_confirm_time = moment(shop.min_confirm_time, 'HH:mm:ss').toDate();
      this.shop = shop;
    })
  ));

  this.updateShop = () => {
    const shop = this.shop.clone();
    shop.min_booking_time = moment(new Date(this.shop.min_booking_time)).format('HH:mm:ss');
    shop.min_confirm_time = moment(new Date(this.shop.min_confirm_time)).format('HH:mm:ss');
    $ionicLoading.show();
    shop.save().then(savedShop => {
      this.serverErrors = {};
      Entities.setCurrentShop(savedShop);
      $state.go('app.logged.shop', { shopId: savedShop.id });
    })
    .catch((error) => {
      if (error.status === 400) {
        this.serverErrors.params = error.data;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
    })
    .finally(() => { $ionicLoading.hide() });
  };
}


