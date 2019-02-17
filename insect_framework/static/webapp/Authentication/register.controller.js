/**
* Register controller
*/
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication'];

  /**
  * @namespace RegisterController
  */
  function RegisterController($location, $scope, Authentication) {
    let self = this;
    self.register = register;

    /**
    * @name register
    * @desc Register a new user
    */
    function register() {
      Authentication.register(self.email, self.password, self.username, self.confirm_password)
        .then (() => {
          $location.url('/');
        }, (response) =>{
          
         $scope.error = response.data.non_field_errors ? response.data.non_field_errors[0] : response.data;
        });

    }
  }
})();