angular.module('app')
.controller('ResourceTypeCtrl', ResourceTypeCtrl);

function ResourceTypeCtrl (Entities, DataService, $ionicPopup, $stateParams, $scope, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService.getResourceTypes(s.id)
      .one($stateParams.resourceTypeId)
      .get()
      .then(response => {
        this.resourceType = response;
        return response;
      })
      .then(response => {
        DataService.getResources(s.id)
        .getList({ resource_type : $stateParams.resourceTypeId })
        .then(resources => {
          this.resources = resources;
        })
      });
    })
  ));

  this.editResource = (resource) => {
    $scope.newResource = resource ? resource.clone() : { resource_type : this.resourceType.id };
    const title = resource
      ? 'Modifica risorsa'
      : 'Nuova risorsa';

    const myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title,
      subTitle: 'Inserisci il nome della risorsa',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.newResource.name) {
              e.preventDefault();
            } else {
              return $scope.newResource;
            }
          }
        }
      ]
    });

    myPopup.then(res => {
      if (!res) {
        return;
      }

      $ionicLoading.show();

      var savePromise;
      if (res.id) {
        savePromise = res.save()
        .then(response => {
          this.resources = _.map(this.resources, r => r.id == response.id ? response : r );
        })
      } else {
        savePromise = DataService.getResources(this.shop.id)
        .post(res)
        .then(response => {
          this.resources.push(response);
        })
      }

      // Handle error and hide loader
      savePromise
      .catch((error) => {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      })
      .finally(() => { $ionicLoading.hide() });
    });
  }


  this.dropResource = resource => {
    const confirmPopup = $ionicPopup.confirm({
      title: 'Elimina risorsa',
      template: `Sicuro di voler eliminare la risorsa ${resource.name}`
    });

    confirmPopup.then(res => {
      if(res) {
        $ionicLoading.show();
        resource.remove()
        .then(() => {
          this.resources = _.reject(this.resources, r => r.id == resource.id)
        })
        .catch((error) => {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        })
        .finally(() => { $ionicLoading.hide() });
      } else {
        console.log('You are not sure');
      }
   });
  }





}


