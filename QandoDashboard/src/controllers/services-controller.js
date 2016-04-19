angular.module('app')
.controller('ServicesCtrl', ServicesCtrl);

function ServicesCtrl (Entities, DataService) {

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService
    .getServices(s.id)
    .getList()
    .then(response => {
      this.services = response.plain();
      console.log(this.services);
    })
  });
}


