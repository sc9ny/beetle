(function () {
  'use strict';

  angular
    .module('routes', [])
    .config(config);

  config.$inject = ['$routeProvider'];

  /**
  * @name config
  * @desc Define valid application routes
  */
  function config($routeProvider) {
    $routeProvider.when('/register', {
      controller: 'RegisterController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/Authentication/templates/register.html'
    }).otherwise('/');
  }
})();