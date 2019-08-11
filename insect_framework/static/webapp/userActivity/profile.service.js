(function () {
  'use strict';

  angular
    .module('profile.services')
    .factory('Profile', Profile)
    .factory('UserProfile', UserProfile);

    Profile.$inject = ['$resource'];
    UserProfile.$inject = ['$resource'];

    function Profile ($resource) {

      let Profile = {
        myPosts : getPosts,
        myComments: getComments
      };

      return Profile;

      function getPosts () {
        return $resource ('api/v1/mypost/');
      }

      function getComments () {
        let cfg = {
          id: '@id'
        };
        return $resource ('api/v1/mycomment/:id/', cfg);
      }
    }

    function UserProfile ($resource) {

      return $resource ('api/v1/accounts/:username/');
    }
})();
