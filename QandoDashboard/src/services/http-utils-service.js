(function(){
  'use strict';

  angular.module('app')
  .factory('HttpUtils', HttpUtils);

  function HttpUtils() {
    var svc = {}

    // Generate a human readable error message from an http error object
    svc.makeErrorMessage = (error) => {
      const { status, data } = error;

      // Show specific API error
      if (data && data.detail) {
        return `Errore del server, ${data.detail}`;
      }

      // Connection/DNS Error, Unvailable service
      if (status <= 0) {
        return 'Servizio non disponibile, riprova più tardi';
      }

      // Error by HTTP status
      switch (status) {

        // Not Found
        case 404:
          return 'Risorsa non trovata';

        // Internal Server Error
        case 500:
          return 'Errore interno del server, riprova più tardi';

        // Generic error message
        default:
          return 'Errore del server, riprova più tardi';
      }
    };


    return svc;
  }

})();
