angular.module('app')
.controller('ServicesCtrl', ServicesCtrl);

function ServicesCtrl (Entities, DataService, $ionicPopup, initialLoaderManager, $timeout) {

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService
      .getServices(s.id)
      .getList()
      .then(response => {
        this.services = response;
      })
    })
  ));

  this.dropService = service => {

    const confirmPopup = $ionicPopup.confirm({
      title: 'Elimina servizio',
      template: `Sicuro di voler eliminare il servizio ${service.name}`
    });

    confirmPopup.then(res => {
      if(res) {
        service.remove()
        .then(()=>{
          this.services = _.reject(this.services, s => s.id == service.id)
        })
      } else {
        console.log('You are not sure');
      }
   });



  }
}


