angular.module('app')
.controller('ServiceCtrl', ServiceCtrl);

function ServiceCtrl (Entities, DataService, $stateParams) {

  
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
      return s
    })
    .then(s => {
      DataService.getServices(s.id)
      .one($stateParams.serviceId)
      .get()
      .then( service => {
        console.log(service)  
        this.serviceTime = moment(service.calculated_duration, 'HH:mm:ss').toDate();
        this.service = {
          service_name : service.name,
          resource_type : _.find(this.resourceTypes, resource => resource.id == service.recipe_items[0].resource_type )
        };
        this.setServiceDuration();

        console.log(this.service)
        console.log(this.serviceTime)

      })
    })
  });



  this.saveService = () => {
    const newServiceForPut = Object.assign({},
      this.service,
      { resource_type: this.service.resource_type.id }
    );

    DataService
      .getSimpleServices(this.shop.id)
      .one($stateParams.serviceId)
      .customPUT(newServiceForPut)
      .then(() => {
        //$state.go('app.logged.services');
      });
  };

  this.setServiceDuration = () => {
    this.service.service_duration = moment(this.serviceTime).format('HH:mm:ss')
    
  }
}


