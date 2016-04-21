angular.module('app')
.controller('ResourceTypeCtrl', ResourceTypeCtrl);

function ResourceTypeCtrl (Entities, DataService, $ionicPopup, $stateParams, $scope, $timeout) {

  Entities
  .getShop()
  .then(s => {
    this.shop=s;
    DataService.getResourceTypes(s.id)
    .one($stateParams.resourceTypeId)
    .get()
    .then(response => {
      this.resourceType = response;
      return response;
    })
    .then(response =>{
      DataService.getResources(s.id)
      .getList({ resource_type : $stateParams.resourceTypeId })
      .then(resources => {
        this.resources = resources;
      })

    })
    
  });


  this.editResource = (resource) => {
    $scope.newResource = resource ? resource.clone() : { resource_type : this.resourceType.id };
    const myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title: 'Nuova risorsa',
      subTitle: 'Inserisci il nome della risorsa',
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
            this.resources = _.map(this.resources, r => r.id == response.id ? response : r );
        })
      } else {
        DataService.getResources(this.shop.id)
        .post(res)
        .then(response => {
          this.resources.push(response)
        })
      }
    });


  }

  
  this.dropResource = resource => {

    const confirmPopup = $ionicPopup.confirm({
      title: 'Elimina risorsa',
      template: `Sicuro di voler eliminare la risorsa ${resource.name}` 
    });

    confirmPopup.then(res => {
      if(res) {
        resource.remove()
        .then(()=>{
          this.resources = _.reject(this.resources, r => r.id == resource.id)
        })
      } else {
        console.log('You are not sure');
      }
   });
  }
  

    

  
}


