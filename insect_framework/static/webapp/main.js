(function () {
  'use strict';

  angular
    .module('main', [
      'config',
      'forum',
      'route',
      'authentication',
      'profile',
      'utils',
      'ngMaterial'
    ]);

  angular
  .module('main')
  .run(run)
  .config(function ($mdIconProvider) {
    $mdIconProvider
      .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
      .defaultIconSet('/static/media/core-icons.svg', 24);
  })
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
      Authentication.logout().then( ()=> {
        $window.location.href ='/';
      });
    };
    $(document).click(function(e) {
	  if (!$(e.target).is('.panel-body')) {
    	$('.collapse').collapse('hide');
    }
});

}
})();
