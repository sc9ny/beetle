(function () {
  'use strict';

  angular
    .module('main', [
      'webapp/config',
      'webapp/routes',
      'webapp/Authentication/authentication'
    ]).run(run);

  run.$inject = ['$http'];

/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}

  angular
    .module('routes', ['ngRoute']);
})();