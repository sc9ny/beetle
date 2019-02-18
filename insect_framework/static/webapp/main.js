(function () {
  'use strict';

  angular
    .module('main', [
      'config',
      'route',
      'authentication',
      'ngMaterial'
    ]);

  angular
  .module('main')
  .run(run);

run.$inject = ['$http'];

/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}
  // angular
  //   .module('routes', ['ngRoute']);
})();

