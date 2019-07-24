(function () {
  'use strict';

  angular
    .module('profile.controllers')
    .controller('profileController', profileController);

    profileController.$inject =
      ['Profile', 'Authentication', 'dynamicEntries'];

    function profileController (Profile, Authentication, dynamicEntries) {
      const self = this;
      this.password = ""
      this.confirm_password= ""
      this.user = Authentication.getAuthenticatedAccount().data;
      self.myPosts = dynamicEntries(Profile.myPosts().query);
      this.hasSearched = false;

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

      this.search = function(searchText) {
      this.hasSearched = true;
        let cfg = {search: searchText}
        self.myPosts = dynamicEntries(Profile.myPosts().query, cfg);
      }
    }

})();
