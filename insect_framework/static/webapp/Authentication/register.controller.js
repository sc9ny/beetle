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
    console.log('loaded');
    self.register = register;

    /**
    * @name register
    * @desc Register a new user
    */
    function register() {
      Authentication.register(self.email, self.password, self.username);
    }
  }
})();