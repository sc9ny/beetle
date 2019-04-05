(function () {
  'use strict';

  angular
    .module('profile.controllers')
    .controller('profileController', profileController);

    profileController.$inject =
      ['Profile', 'Authentication', 'dynamicEntries'];

    function profileController (Profile, Authentication, dynamicEntries) {
      self = this;
      this.password = ""
      this.confirm_password= ""
      this.user = Authentication.getAuthenticatedAccount().data;
      self.myPosts = dynamicEntries(Profile.myPosts().query);

      this.changePassword = function () {
        Authentication.changePassword(self.user.username, self.password,
          self.confirm_password).then(() => {
            self.password = "";
            self.confirm_password = "";
            self.message = "Your password has been changed"
            self.error= ""
          }, (error) => {
            self.error = "Password not matched"
            self.message=""
          });
      }
    }

})();
