'use strict';

angular.module('app').controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Entities, DataService, $q, initialLoaderManager, notifyManager, HttpUtils, $scope) {
  var _this = this;

  var loadHomeData = function loadHomeData() {
    var now = moment().subtract(1, 'hours');
    var qPending = DataService.getBookings(_this.shop.id).getList({ status: 'pending', 'start__gte': now.format('YYYY-MM-DDTHH:mm:00') });

    var qConfirmed = DataService.getBookings(_this.shop.id).getList({ status: 'confirmed', 'start__gte': now.format('YYYY-MM-DDTHH:mm:00') });

    return $q.all([qPending, qConfirmed]).then(function (results) {
      _this.pending = results[0];
      _this.numPending = results[0].metadata.count;
      _this.confirmed = results[1];
      _this.numConfirmed = results[1].metadata.count;
      return results;
    });
  };

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return loadHomeData();
    });
  });

  this.refresh = function () {
    loadHomeData().catch(function (error) {
      notifyManager.error(HttpUtils.makeErrorMessage(error));
    }).finally(function () {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
}