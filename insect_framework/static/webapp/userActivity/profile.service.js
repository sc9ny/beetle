(function () {
  'use strict';

  angular
    .module('profile.services')
    .factory('Profile', Profile);

    Profile.$inject = ['$resource'];

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
})();
