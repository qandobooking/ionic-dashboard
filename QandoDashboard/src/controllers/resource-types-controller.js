angular.module('app')
.controller('ResourceTypesCtrl', ResourceTypesCtrl);

function ResourceTypesCtrl (Entities, DataService, $ionicPopup, $scope, $ionicListDelegate, initialLoaderManager) {

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService.getResourceTypes(s.id)
      .getList()
      .then(response => {
        this.resourceTypes = response;
      });
    })
  ));


  this.editResourceType = (resourceType) => {
    $ionicListDelegate.closeOptionButtons();
    $scope.newResource = resourceType ? resourceType.clone() : {};
    const myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title: 'Nuova risorsa',
      subTitle: 'Inserisci il nome del tipo di risorsa',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newResource.name) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.newResource;
            }
          }
        }
      ]
    });

    myPopup.then(res => {
      if(!res){
        return
      }

      if(res.id){
        res.save()
        .then(response => {
            this.resourceTypes = _.map(this.resourceTypes, r => r.id == response.id ? response : r );
        })
      } else {
        DataService.getResourceTypes(this.shop.id)
        .post(res)
        .then(response => {
          this.resourceTypes.push(response)
        })
      }
    });


  }



  /*
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
  */




}


