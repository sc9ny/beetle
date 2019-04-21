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
    when ('/about/', {
      controller: function () {},
      templateUrl:'/static/webapp/about.html'
    }).
    when ('/profile/', {
      controller: 'profileController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/userActivity/templates/profile.html'
    }).
    when ('/forum/', {
      controller: 'forumController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum.html'
    }).
    when ('/forum/create/', {
      controller: 'manageForumController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum_manage.html',
      resolve : {
        currentForum : () => {
          return null;
        },
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when ('/forum/update/:id/', {
      controller: 'manageForumController',
      controllerAs: '$ctrl',
      templateUrl: 'static/webapp/forum/templates/forum_manage.html',
      resolve: {
        currentForum : ($route, Forum) => {
          return Forum.get({id:$route.current.params.id}).$promise;
        },
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when ('/forum/:id/', {
      controller: 'forumDetailController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum_detail.html',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when ('/', {
      templateUrl: '/static/webapp/base.html'
    }).
    otherwise({
      redirectTo: '/notFound/',
      templateUrl: '/static/webapp/notFound.html',
      controller: function ($scope) {

      }
    });
  }
})();
