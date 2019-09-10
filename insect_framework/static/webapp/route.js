(function () {
  'use strict';

  const route = angular
    .module('route', ['ngRoute'])
    .config(config);

  config.$inject = ['$routeProvider'];

  route.controller("routeController", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function () {
      //$location.url('/notFound/')
    });
  });

  function config($routeProvider) {
    $routeProvider.when('/register/', {
      controller: 'RegisterController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/Authentication/templates/register.html/'
    }).
    when ('/login/', {
      controller: 'LoginController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/Authentication/templates/login.html/'
    }).
    when ('/about/', {
      controller: function () {},
      templateUrl:'/static/webapp/about.html/'
    }).
    when ('/profile/', {
      controller: 'profileController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/userActivity/templates/profile.html/'
    }).
    when ('/profile/:id/', {
      controller: 'userProfileController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/userActivity/templates/user-profile.html/',
      resolve: {
        user : ($route, UserProfile) => {
          return UserProfile.get({username:$route.current.params.id}).$promise;
        },
      }
    }).
    when ('/chat/', {
      controller: 'chatListController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/chat/templates/chat-list.html',
    }).
    when ('/chat/:id/', {
      controller: 'chatController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/chat/templates/room.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        },
        currentChat : ($route) => {
          return $route.current.params.id;
        },
      }
    }).
    when ('/forum/', {
      controller: 'forumController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when ('/forum/create/', {
      controller: 'manageForumController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum_manage.html/',
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
      templateUrl: 'static/webapp/forum/templates/forum_manage.html/',
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
      templateUrl: '/static/webapp/forum/templates/forum_detail.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        },
        currentForum : ($route, Forum) => {
          return Forum.get({id:$route.current.params.id}).$promise;
        },
      }
    }).
    when ('/gallery/', {
      controller: 'galleryController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/gallery/templates/gallery.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when('/gallery/create/', {
      controller: 'galleryManageController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/gallery/templates/gallery_manage.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when('/gallery/:id/', {
      controller: 'galleryDetailController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/gallery/templates/gallery_detail.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        },
        currentGallery: ($route, GalleryPost) => {
          return GalleryPost.get({id:$route.current.params.id}).$promise;
        }
      }
    }).
    when('/question/', {
      controller: 'questionController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).

    when ('/question/create/', {
      controller: 'manageQuestionController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum_manage.html/',
      resolve : {
        currentForum : () => {
          return null;
        },
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when ('/question/update/:id/', {
      controller: 'manageQuestionController',
      controllerAs: '$ctrl',
      templateUrl: 'static/webapp/forum/templates/forum_manage.html/',
      resolve: {
        currentForum : ($route, Question) => {
          return Question.get({id:$route.current.params.id}).$promise;
        },
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when('/question/:id/', {
      controller: 'questionDetailController',
      controllerAs: '$ctrl',
      templateUrl: 'static/webapp/forum/templates/forum_detail.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        },
        currentQuestion : ($route, Question) => {
          return Question.get({id:$route.current.params.id}).$promise;
        },
      }
    }).

    when('/sale/', {
      controller: 'saleController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).

    when ('/sale/create/', {
      controller: 'manageSaleController',
      controllerAs: '$ctrl',
      templateUrl: '/static/webapp/forum/templates/forum_manage.html/',
      resolve : {
        currentForum : () => {
          return null;
        },
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        }
      }
    }).
    when('/sale/:id/', {
      controller: 'saleDetailController',
      controllerAs: '$ctrl',
      templateUrl: 'static/webapp/forum/templates/forum_detail.html/',
      resolve: {
        user: (Authentication) => {
          return Authentication.getAuthenticatedAccount().data;
        },
        currentSale : ($route, Sale) => {
          return Sale.get({id:$route.current.params.id}).$promise;
        },
      }
    }).

    when ('/sale/update/:id/', {
      controller: 'manageSaleController',
      controllerAs: '$ctrl',
      templateUrl: 'static/webapp/forum/templates/forum_manage.html/',
      resolve: {
        currentForum : ($route, Sale) => {
          return Sale.get({id:$route.current.params.id}).$promise;
        },
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
