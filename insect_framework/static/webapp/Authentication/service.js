/**
* Authentication
*/
(function () {
  'use strict';

  angular
    .module('authentication.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$cookies', '$http'];

  /**
  * @namespace Authentication
  * @returns {Factory}
  */
  function Authentication($cookies, $http) {
    /**
    * @name Authentication
    * @desc The Factory to be returned
    */
    var Authentication = {
      register: register
    };

    return Authentication;



    function register(email, password, username, confirm_password) {
      return $http.post('/api/v1/accounts/', {
        username: username,
        password: password,
        confirm_password: confirm_password,
        email: email
      });
    }
  }
})();