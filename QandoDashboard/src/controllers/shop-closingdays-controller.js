angular.module('app')
.controller('ShopClosingDaysCtrl', ShopClosingDaysCtrl);

function ShopClosingDaysCtrl (Entities, DataService, initialLoaderManager, notifyManager, HttpUtils) {

  var restangularItems = {};

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService
      .getShopClosingDays(s.id)
      .getList({'fixed' : true })
      .then(response => {
        this.closingDays = response.map(item => {
          restangularItems[item.date] = item;
          return moment(item.date);
        });
      })
    })
  ));

  this.onDayToggled = (d, selected) => {
    let date = d.format('YYYY-MM-DD');
    if (selected) {
      const item = { date, fixed: true };
      DataService
      .getShopClosingDays(this.shop.id)
      .post(item)
      .then(savedItem => {
        restangularItems[date] = savedItem;
      })
      .catch((error) => {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    } else {
      const oldItem = restangularItems[date];
      oldItem
      .remove()
      .then(() => {
        delete restangularItems[date];
      })
      .catch((error) => {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      });
    }
  };
}
