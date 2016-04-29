angular.module('app')
.controller('AddServiceCtrl', AddServiceCtrl);

function AddServiceCtrl (Entities, DataService, $state, initialLoaderManager, $ionicLoading, notifyManager, HttpUtils) {

  this.newService = {};
  this.serverErrors = {};
  this.serviceTime = moment({hours:1}).toDate();

  this.loader = initialLoaderManager.makeLoader(() => (
    Entities
    .getShop()
    .then(s => {
      this.shop=s;
      return DataService.getResourceTypes(s.id)
      .getList()
      .then(response => {
        if (response.length === 1) {
          this.newService.resource_type = response[0].plain();
        }
        this.resourceTypes = response.plain();
      });
    })
  ));

  this.addService = () => {
    const newServiceForPost = Object.assign({},
      this.newService,
      { resource_type: this.newService.resource_type.id }
    );

    $ionicLoading.show();
    DataService
      .getSimpleServices(this.shop.id)
      .post(newServiceForPost)
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

  this.setServiceDuration = () => {
    this.newService.service_duration = moment(this.serviceTime).format('HH:mm:ss')
  };
}


