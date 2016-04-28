'use strict';

angular.module('app').controller('ServiceCtrl', ServiceCtrl);

function ServiceCtrl(Entities, DataService, $stateParams, initialLoaderManager, $timeout) {
  var _this = this;

  this.loader = initialLoaderManager.makeLoader(function () {
    return Entities.getShop().then(function (s) {
      _this.shop = s;
      return DataService.getResourceTypes(s.id).getList().then(function (response) {
        if (response.length === 1) {
          _this.newService.resource_type = response[0].plain();
        }
        _this.resourceTypes = response.plain();
        return s;
      }).then(function (s) {
        return DataService.getServices(s.id).one($stateParams.serviceId).get().then(function (service) {
          _this.serviceTime = moment(service.calculated_duration, 'HH:mm:ss').toDate();
          _this.service = {
            service_name: service.name,
            resource_type: _.find(_this.resourceTypes, function (resource) {
              return resource.id == service.recipe_items[0].resource_type;
            })
          };
          _this.setServiceDuration();
        });
      });
    });
  });

  this.saveService = function () {
    var newServiceForPut = Object.assign({}, _this.service, { resource_type: _this.service.resource_type.id });

    DataService.getSimpleServices(_this.shop.id).one($stateParams.serviceId).customPUT(newServiceForPut).then(function () {
      //$state.go('app.logged.services');
    });
  };

  this.setServiceDuration = function () {
    _this.service.service_duration = moment(_this.serviceTime).format('HH:mm:ss');
  };
}