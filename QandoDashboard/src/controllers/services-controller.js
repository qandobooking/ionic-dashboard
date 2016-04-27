angular.module('app')
.controller('ServicesCtrl', ServicesCtrl);

function ServicesCtrl (Entities, DataService, $ionicPopup, initialLoaderManager) {

  initialLoaderManager.start('services', () => 
    (
      Entities
      .getShop()
      .then(s => {
        this.shop=s;
        DataService
        .getServices(s.id)
        .getList()
        .then(response => {
          this.services = response;//.plain();
        })
      })
    )
  )




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


