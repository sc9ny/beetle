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
  .run(run)
  .controller('mainController', mainController);

run.$inject = ['$http'];
mainController.$inject=['Authentication', '$scope', '$window'];
/**
* @name run
* @desc Update xsrf $http headers to align with Django's defaults
*/
function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}
function mainController(Authentication, $scope, $window) {
  $scope.loggedIn = Authentication.isAuthenticated();
  $scope.logout = function () {
      Authentication.logout();
      $window.location.href ='/';
    }

}
})();


