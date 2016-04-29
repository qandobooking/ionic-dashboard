'use strict';

angular.module('app').controller('ResourceTypeCtrl', ResourceTypeCtrl);

function ResourceTypeCtrl(Entities, DataService, $ionicPopup, $stateParams, $scope, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getResourceTypes(s.id).one($stateParams.resourceTypeId).get().then(function (response) {
        _this.resourceType = response;
        return response;
      }).then(function (response) {
        DataService.getResources(s.id).getList({ resource_type: $stateParams.resourceTypeId }).then(function (resources) {
          _this.resources = resources;
        });
      });
    });
  });

  this.editResource = function (resource) {
    $scope.newResource = resource ? resource.clone() : { resource_type: _this.resourceType.id };
    var title = resource ? 'Modifica risorsa' : 'Nuova risorsa';

    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="newResource.name">',
      title: title,
      subTitle: 'Inserisci il nome della risorsa',
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
          _this.resources = _.map(_this.resources, function (r) {
            return r.id == response.id ? response : r;
          });
        });
      } else {
        savePromise = DataService.getResources(_this.shop.id).post(res).then(function (response) {
          _this.resources.push(response);
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

  this.dropResource = function (resource) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Elimina risorsa',
      template: 'Sicuro di voler eliminare la risorsa ' + resource.name
    });

    confirmPopup.then(function (res) {
      if (res) {
        $ionicLoading.show();
        resource.remove().then(function () {
          _this.resources = _.reject(_this.resources, function (r) {
            return r.id == resource.id;
          });
        }).catch(function (error) {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        }).finally(function () {
          $ionicLoading.hide();
        });
      } else {
        console.log('You are not sure');
      }
    });
  };
}