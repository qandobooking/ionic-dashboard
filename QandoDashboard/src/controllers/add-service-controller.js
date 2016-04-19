angular.module('app')
.controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl (Entities, DataService, $state) {

  this.newService = {};

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService.getResourceTypes(s.id)
    .getList()
    .then(response => {
      if (response.length === 1) {
        this.newService.resource_type = response[0].plain();
      }
      this.resourceTypes = response.plain();
    });
  });

  this.addService = () => {
    const newServiceForPost = Object.assign({},
      this.newService,
      { resource_type: this.newService.resource_type.id }
    );

    DataService
      .getSimpleServices(this.shop.id)
      .post(newServiceForPost)
      .then(() => {
        $state.go('app.logged.services');
      });
  };
}


