(function () {
  'use strict';

  angular
    .module('main', [
      'config',
      'forum',
      'route',
      'authentication',
      'profile',
      'gallery',
      'utils',
      'sale',
      'question',
      'chat',
      'ngMaterial',
    ]);

  angular
  .module('main')
  .run(run)
  .config(function ($mdIconProvider) {
    $mdIconProvider
      .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
      .defaultIconSet('/static/media/core-icons.svg', 24);
  })
  .controller('mainController', mainController)
  .factory('Notification', Notification)
  .directive('ckEditor', [function () {
  return {
    require: '?ngModel',
    link: function ($scope, elm, attr, ngModel) {

        var ck = CKEDITOR.replace(elm[0]);

        ck.on('pasteState', function () {
            $scope.$apply(function () {
                ngModel.$setViewValue(ck.getData());
            });
        });

        ngModel.$render = function (value) {
            ck.setData(ngModel.$modelValue);
        };
    }
  };
}]);

  run.$inject = ['$http'];
  mainController.$inject=['Authentication','$window', '$scope', '$mdMedia', '$mdSidenav', '$timeout',];
  Notification.$inject =['$resource']
  /**
  * @name run
  * @desc Update xsrf $http headers to align with Django's defaults
  */
  function run($http) {
    $http.defaults.xsrfHeaderName = 'X-CSRFToken';
    $http.defaults.xsrfCookieName = 'csrftoken';
  }


  function mainController(Authentication, $window, $scope, $mdMedia, $mdSidenav, $timeout) {
    $scope.$mdMedia = $mdMedia;
    $scope.lock = false;
    $timeout(function () {
      $mdSidenav('left').open();
    });
    $scope.screenHeight = $(window).height()-64 + 'px';

    $scope.toggleNav = function() {
      $mdSidenav('left').toggle();
    }
    $scope.loggedIn = Authentication.isAuthenticated();
    $scope.logout = function () {
      Authentication.logout().then( ()=> {
        $window.location.href ='/';
      });
    };

    $scope.toggleLock = function() {
      $scope.lock = !$scope.lock;
      return $scope.lock;
    }

    $scope.openMenu = function($mdMenu, ev) {
      $mdMenu.open(ev);
    }
  }
})();
