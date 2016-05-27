angular.module('app')
.controller('HomeCtrl', HomeCtrl);

function HomeCtrl (Entities, DataService, $q, initialLoaderManager, notifyManager, HttpUtils, $scope) {

  const loadHomeData = () => {
    const now = moment().subtract(1, 'hours');
    const qPending = DataService
    .getBookings(this.shop.id)
    .getList({ status : 'pending', 'start__gte':now.format('YYYY-MM-DDTHH:mm:00') })

    const qConfirmed = DataService
    .getBookings(this.shop.id)
    .getList({ status : 'confirmed', 'start__gte':now.format('YYYY-MM-DDTHH:mm:00') })

    return $q.all([qPending, qConfirmed])
    .then(results => {
      this.pending = results[0];
      this.numPending = results[0].metadata.count;
      this.confirmed = results[1];
      this.numConfirmed = results[1].metadata.count;
      return results;
    });
  };

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return loadHomeData();
    })
  ));

  this.refresh = () => {
    loadHomeData()
    .catch((error) => {
      notifyManager.error(HttpUtils.makeErrorMessage(error));
    })
    .finally(() => {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

}
