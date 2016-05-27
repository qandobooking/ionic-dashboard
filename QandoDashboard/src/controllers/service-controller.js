angular.module('app')
.controller('ServiceCtrl', ServiceCtrl);

function ServiceCtrl (Entities, DataService, $state, $stateParams, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {

  this.serverErrors = {};
  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop = s;
      return DataService.getResourceTypes(s.id)
      .getList()
      .then(response => {
        this.resourceTypes = response.plain();
        return s;
      })
      .then(s => {
        return DataService.getServices(s.id)
        .one($stateParams.serviceId)
        .get()
        .then(service => {
          this.service = {
            service_name: service.name,
            service_description: service.description,
            resource_type: _.find(this.resourceTypes, resource => resource.id == service.recipe_items[0].resource_type),
            service_duration: moment(service.calculated_duration, 'HH:mm:ss').toDate(),
            min_booking_time: service.service_min_booking_time
              ? moment(service.service_min_booking_time, 'HH:mm:ss').toDate()
              : moment(service.min_booking_time, 'HH:mm:ss').toDate(),
            min_confirm_time: service.service_min_confirm_time
              ? moment(service.service_min_confirm_time, 'HH:mm:ss').toDate()
              : moment(service.min_confirm_time, 'HH:mm:ss').toDate(),
          };
          this.inheritMinBookingTime = service.service_min_booking_time === null;
          this.inheritMinConfirmTime = service.service_min_confirm_time === null;
        });
      })
    })
  ));

  this.saveService = () => {
    const newServiceForPut = Object.assign({},
      this.service,
      {
        resource_type: this.service.resource_type.id,
        service_duration: moment(new Date(this.service.service_duration)).format('HH:mm:ss')
      }
    );

    newServiceForPut.service_min_booking_time = this.inheritMinBookingTime
      ? null
      : moment(new Date(this.service.min_booking_time)).format('HH:mm:ss');

    newServiceForPut.service_min_confirm_time = this.inheritMinConfirmTime
      ? null
      : moment(new Date(this.service.min_confirm_time)).format('HH:mm:ss');

    $ionicLoading.show();
    DataService
      .getSimpleServices(this.shop.id)
      .one($stateParams.serviceId)
      .customPUT(newServiceForPut)
      .then(() => {
        this.serverErrors = {};
        $state.go('app.logged.services');
      })
      .catch((error) => {
        if (error.status === 400) {
          this.serverErrors.params = error.data;
        } else {
          notifyManager.error(HttpUtils.makeErrorMessage(error));
        }
      })
      .finally(() => { $ionicLoading.hide() });
  };
}
