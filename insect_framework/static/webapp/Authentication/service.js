/**
* Authentication
*/
(function () {
  'use strict';

  angular
    .module('authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http', '$location'];

  function Authentication($cookies, $http, $location) {
    let Authentication = {
      register: register,
      changePassword: changePassword,
      getAuthenticatedAccount: getAuthenticatedAccount,
      isAuthenticated: isAuthenticated,
      setAuthenticatedAccount: setAuthenticatedAccount,
      unAuthenticate: unAuthenticate,
      login: login,
      logout: logout
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
    function changePassword(user_id, password, confirm_password) {
      return $http.patch('api/v1/accounts/' + user_id +'/', {
        password: password,
        confirm_password: confirm_password
      })
    }
    function getAuthenticatedAccount () {
      if (!$cookies.get('authenticatedAccount')) {
        logout();
        return {};
      }

      return JSON.parse($cookies.get('authenticatedAccount'));
    }

    function isAuthenticated () {
      return !!$cookies.get('authenticatedAccount')
    }

    function setAuthenticatedAccount(account) {
      $cookies.put('authenticatedAccount', JSON.stringify(account),{
        //expires: (new Date(new Date().getTime() + 30 * 60 * 1000).toString())
      });
    }

    function unAuthenticate () {
      $cookies.remove('authenticatedAccount');
    }

    function login(email, password) {
      return $http.post('/api/v1/login/', {
        email: email,
        password: password
      })
    }

    function logout() {
      return $http.post('/api/v1/logout/').then((success) =>{
        unAuthenticate();
        $location.url('/')
      })
    }
    // function login() {
    //   let cfg = {
    //     email: '@email',
    //     password: '@password'
    //   };
    //   let action = {
    //     login : {method: "POST"}
    //   };
    //   return $resource('/api/v1/login', cfg, action);
    // }
  }

})();
