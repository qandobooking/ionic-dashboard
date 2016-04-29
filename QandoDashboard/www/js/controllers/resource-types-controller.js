'use strict';

angular.module('app').controller('ResourceTypesCtrl', ResourceTypesCtrl);

function ResourceTypesCtrl(Entities, DataService, $ionicPopup, $scope, $ionicListDelegate, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getResourceTypes(s.id).getList().then(function (response) {
        _this.resourceTypes = response;
      });
    });
  });

  this.editResourceType = function (resourceType) {
    $ionicListDelegate.closeOptionButtons();
    $scope.newResource = resourceType ? resourceType.clone() : {};
    var title = resourceType ? 'Modifica tipo risorsa' : 'Nuovo tipo risorsa';

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title: title,
      subTitle: 'Inserisci il nome del tipo di risorsa',
      scope: $scope,
      buttons: [{ text: 'Cancel' }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function onTap(e) {
          if (!$scope.newResource.name) {
            e.preventDefault();
          } else {
            return $scope.newResource;
          }
        }
      }]
    });

    myPopup.then(function (res) {
      if (!res) {
        return;
      }

      $ionicLoading.show();
      var savePromise;
      if (res.id) {
        savePromise = res.save().then(function (response) {
          _this.resourceTypes = _.map(_this.resourceTypes, function (r) {
            return r.id == response.id ? response : r;
          });
        });
      } else {
        savePromise = DataService.getResourceTypes(_this.shop.id).post(res).then(function (response) {
          _this.resourceTypes.push(response);
        });
      }

      // Handle error and hide loader
      savePromise.catch(function (error) {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }).finally(function () {
        $ionicLoading.hide();
      });
    });
  };

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