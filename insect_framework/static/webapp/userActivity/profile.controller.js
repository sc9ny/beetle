(function () {
  'use strict';

  angular
    .module('profile.controllers')
    .controller('profileController', profileController);

    profileController.$inject =
      ['Profile', 'Authentication', 'dynamicEntries'];

    function profileController (Profile, Authentication, dynamicEntries) {
      self = this;
      this.user = Authentication.getAuthenticatedAccount().data;
      this.myPosts = dynamicEntries(Profile);
      this.promise = Profile.myPosts().query(function (response, headerGetter) {
        self.posts = response;
      });
      this.promise = Profile.myComments().query(function (response, headerGetter)
      {
        self.comments = response;
      });
    }

})();
