'use strict';

angular.module('app').controller('ResourceTypesCtrl', ResourceTypesCtrl);

function ResourceTypesCtrl(Entities, DataService, $ionicPopup, $scope, $ionicListDelegate) {
  var _this = this;

  Entities.getShop().then(function (s) {
    _this.shop = s;
    DataService.getResourceTypes(s.id).getList().then(function (response) {
      _this.resourceTypes = response;
      console.log(2);
    });
  });

  this.editResourceType = function (resourceType) {
    $ionicListDelegate.closeOptionButtons();
    $scope.newResource = resourceType ? resourceType.clone() : {};
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title: 'Nuova risorsa',
      subTitle: 'Inserisci il nome del tipo di risorsa',
      scope: $scope,
      buttons: [{ text: 'Cancel' }, {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function onTap(e) {
          if (!$scope.newResource.name) {
            //don't allow the user to close unless he enters wifi password
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

      if (res.id) {
        res.save().then(function (response) {
          _this.resourceTypes = _.map(_this.resourceTypes, function (r) {
            return r.id == response.id ? response : r;
          });
        });
      } else {
        DataService.getResourceTypes(_this.shop.id).post(res).then(function (response) {
          _this.resourceTypes.push(response);
        });
      }
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