'use strict';

angular.module('app').controller('ServiceCtrl', ServiceCtrl);

function ServiceCtrl(Entities, DataService, $state, $stateParams, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {
  var _this = this;

  this.serverErrors = {};
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
          _this.service = {
            service_name: service.name,
            resource_type: _.find(_this.resourceTypes, function (resource) {
              return resource.id == service.recipe_items[0].resource_type;
            }),
            service_duration: moment(service.calculated_duration, 'HH:mm:ss').toDate(),
            min_booking_time: service.service_min_booking_time ? moment(service.service_min_booking_time, 'HH:mm:ss').toDate() : moment(service.min_booking_time, 'HH:mm:ss').toDate(),
            min_confirm_time: service.service_min_confirm_time ? moment(service.service_min_confirm_time, 'HH:mm:ss').toDate() : moment(service.min_confirm_time, 'HH:mm:ss').toDate()
          };
          _this.inheritMinBookingTime = service.service_min_booking_time === null;
          _this.inheritMinConfirmTime = service.service_min_confirm_time === null;
        });
      });
    });
  });

  this.saveService = function () {
    var newServiceForPut = Object.assign({}, _this.service, {
      resource_type: _this.service.resource_type.id,
      service_duration: moment(new Date(_this.service.service_duration)).format('HH:mm:ss')
    });

    newServiceForPut.service_min_booking_time = _this.inheritMinBookingTime ? null : moment(new Date(_this.service.min_booking_time)).format('HH:mm:ss');

    newServiceForPut.service_min_confirm_time = _this.inheritMinConfirmTime ? null : moment(new Date(_this.service.min_confirm_time)).format('HH:mm:ss');

    $ionicLoading.show();
    DataService.getSimpleServices(_this.shop.id).one($stateParams.serviceId).customPUT(newServiceForPut).then(function () {
      _this.serverErrors = {};
      $state.go('app.logged.services');
    }).catch(function (error) {
      if (error.status === 400) {
        _this.serverErrors.params = error.data;
      } else {
        notifyManager.error(HttpUtils.makeErrorMessage(error));
      }
    }).finally(function () {
      $ionicLoading.hide();
    });
  };
}