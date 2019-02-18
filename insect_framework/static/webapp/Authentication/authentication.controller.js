/**
* Register controller
*/
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('RegisterController', RegisterController)
    .controller('LoginController', LoginController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication'];
  LoginController.$inject = ['Authentication', '$scope', '$location'];

  function RegisterController($location, $scope, Authentication) {
    let self = this;
    self.register = register;

    function register() {
      Authentication.register(self.email, self.password, self.username, self.confirm_password)
        .then (() => {
          Authentication.login(self.email, self.password);
          $location.url('/');
        }, (response) =>{

         $scope.error = response.data.non_field_errors ? response.data.non_field_errors[0]
           : response.data;
        });

    }
    this.logout = function () {
      Authentication.logout();
    }
  }

  function LoginController(Authentication, $scope, $location) {
    let self = this;
    self.email ='';
    self.password = '';
    if (Authentication.isAuthenticated())
      $location.url('/');

    this.login = function () {
      Authentication.login(self.email, self.password).then((success) => {
        Authentication.setAuthenticatedAccount(success);
        $location.url('/');
      }, (error) => {
        $scope.error = error.data.message;
      });
    };
  }
})();