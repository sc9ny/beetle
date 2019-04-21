/**
* Register controller
*/
(function () {
  'use strict';

  angular
    .module('authentication.controllers')
    .controller('RegisterController', RegisterController)
    .controller('LoginController', LoginController);

  RegisterController.$inject = ['$location', '$scope', 'Authentication', '$window'];
  LoginController.$inject = ['Authentication', '$scope', '$location', '$window'];

  function RegisterController($location, $scope, Authentication, $window) {
    let self = this;
    self.register = register;

    function register() {
      Authentication.register(self.email, self.password, self.username, self.confirm_password)
        .then (() => {
          Authentication.login(self.email, self.password).then((success) => {
            Authentication.setAuthenticatedAccount(success)
            $window.location.href ='/';
          });

        }, (response) =>{
         $scope.error = response.data.non_field_errors ? response.data.non_field_errors[0]
           : response.data;
        });

    }
  }

  function LoginController(Authentication, $scope, $location, $window) {
    let self = this;
    self.email ='';
    self.password = '';
    if (Authentication.isAuthenticated())
      $window.location.href ='/';

    this.login = function () {
      Authentication.login(self.email, self.password).then((success) => {
        Authentication.setAuthenticatedAccount(success);
        $window.location.href ='/';
      }, (error) => {
        $scope.error = error.data.message;
      });
    };
  }
})();
