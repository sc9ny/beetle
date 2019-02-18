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
  LoginController.$inject = ['Login', 'Authentication', '$scope', '$location'];

  function RegisterController($location, $scope, Authentication) {
    let self = this;
    self.register = register;

    function register() {
      Authentication.register(self.email, self.password, self.username, self.confirm_password)
        .then (() => {
          $location.url('/');
        }, (response) =>{

         $scope.error = response.data.non_field_errors ? response.data.non_field_errors[0]
           : response.data;
        });

    }
  }

  function LoginController(Login, Authentication, $scope, $location) {
    let self = this;
    self.email ='';
    self.password = '';
    console.log(Authentication.isAuthenticated());
    if (Authentication.isAuthenticated())
      $location.url('/');

    this.login = function () {
      Login.login({email: self.email, password:self.password}).$promise.then((success) => {
        console.log(success);
        Authentication.setAuthenticatedAccount(success);
        $location.url('/');
      }, (error) => {
        $scope.error = error.data.message;
      });
    }
  }
})();