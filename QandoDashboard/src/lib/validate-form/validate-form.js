(function() {
  'use strict';

  angular.module('validate-form', ['ngMessages'])
  .provider('validateForm', validateFormProvider);

  function validateFormProvider(){

    var config = {
      errorsTemplateUrl : null,
      serverErrorsTemplateUrl : null,
      labelErrorClass : 'label-has-error',
      formErrorsClass : 'forms-error',
      formErrorClass : 'form-error',
    }

    return {

        setOptions : function(options){
          Object.assign(config, options);
        },

        $get : function (){
            return config;
        }
    }
  }

})();
