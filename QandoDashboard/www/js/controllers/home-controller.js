'use strict';

angular.module('app').controller('HomeCtrl', HomeCtrl);

function HomeCtrl(Entities, DataService, $q, initialLoaderManager) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;

      var qPending = DataService.getBookings(s.id).getList({ status: 'pending' });

      var qConfirmed = DataService.getBookings(s.id).getList({ status: 'confirmed' });

      return $q.all([qPending, qConfirmed]).then(function (results) {
        _this.pending = results[0];
        _this.numPending = results[0].metadata.count;
        _this.confirmed = results[1];
        _this.numConfirmed = results[1].metadata.count;
        return results;
      });
    });
  });
}