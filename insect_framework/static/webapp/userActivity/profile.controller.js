(function () {
  'use strict';

  angular
    .module('profile.controllers')
    .controller('profileController', profileController);

    profileController.$inject = ['Profile', 'Authentication'];

    function profileController (Profile, Authentication) {
      let user = Authentication.getAuthenticatedAccount().data;
      let pro = Profile.myPosts().get(function (response, headerGetter) {
        console.log(headerGetter('X-count'));
        console.log(response);
        //console.log(pro);
      });
    }
})();