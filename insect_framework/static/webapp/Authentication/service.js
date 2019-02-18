/**
* Authentication
*/
(function () {
  'use strict';

  angular
    .module('authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$resource'];

  function Authentication($cookies, $http, $resource) {
    let Authentication = {
      register: register,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unAuthenticate: unAuthenticate,
      login: login
    };

    return Authentication;



    function register(email, password, username, confirm_password) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        confirm_password: confirm_password,
        email: email
      })
    }
    function getAuthenticatedAccount () {
      if (!$cookies.get('authenticatedAccount'))
        return;

      return JSON.parse($cookies.get('authenticatedAccount'));
    }

    function isAuthenticated () {
      return !!$cookies.get('authenticatedAccount')
    }

    function setAuthenticatedAccount(account) {
      $cookies.put('authenticatedAccount', JSON.stringify(account),{
        expires: (new Date(new Date().getTime() + 30 * 60 * 1000).toString())
      });
    }

    function unAuthenticate () {
      $cookies.remove('authenticatedAccount');
    }
    function login($resource) {
      let cfg = {
        email: '@email',
        password: '@password'
      };
      let action = {
        login : {method: "POST"}
      };
      return $resource('/api/v1/login', cfg, action);
    }
  }

})();