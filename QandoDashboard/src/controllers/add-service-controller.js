angular.module('app')
.controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl (Entities, DataService) {

  this.newService = {};

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
  });
}


