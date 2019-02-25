(function () {
  'use strict';

  angular
    .module('route', ['ngRoute'])
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/register/', {
      controller: 'RegisterController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/Authentication/templates/register.html'
    }).
    when ('/login/', {
      controller: 'LoginController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/Authentication/templates/login.html'
    }).
    otherwise({
      redirectTo: '/',
      templateUrl: '/static/webapp/base.html',
      controller: function ($scope) {
        $scope.message = "WELCOME";
        console.log('hi');
      }
    });
  }
})();