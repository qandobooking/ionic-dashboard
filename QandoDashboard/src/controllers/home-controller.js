angular.module('app')
.controller('HomeCtrl', HomeCtrl);

function HomeCtrl (Entities, DataService, $q, initialLoaderManager) {

  
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;

      const qPending = DataService
      .getBookings(s.id)
      .getList({ status : 'pending' })

      const qConfirmed = DataService
      .getBookings(s.id)
      .getList({ status : 'confirmed' })

      return $q.all([qPending, qConfirmed])
      .then(results => {
        this.pending = results[0];
        this.numPending = results[0].metadata.count;
        this.confirmed = results[1];
        this.numConfirmed = results[1].metadata.count;
        return results;
      })

    })
  ));

  



}


