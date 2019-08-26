(function () {
  'use strict';

  angular
    .module('profile.controllers')
    .controller('profileController', profileController)
    .controller('userProfileController', userProfileController)
    .component('profileComponent', {
      templateUrl: '/static/webapp/userActivity/templates/user-profile.html/',
      controller: userProfileController,
      controllerAs: '$ctrl',
      bindings: {
        user: '<'
      }
    });

    profileController.$inject =
      ['Profile', 'Authentication', 'dynamicEntries'];

    userProfileController.$inject = ['UserProfile', 'Authentication', 'dynamicEntries',
                                      'Forum', 'SimpleGalleryPost', 'Sale', 'Question', '$route']

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

    function userProfileController (UserProfile, Authentication, dynamicEntries, Forum,
                                    SimpleGalleryPost, Sale, Question, $route, user) {
      const self = this;
      if (!self.user && $route.current.params.id) {
        UserProfile.get({username: $route.current.params.id}).$promise.then((response) => {
          self.query = {profile: response.username};
          self.user = response;
          self.otherProfile = Authentication.getAuthenticatedAccount().data.username !== self.user.username
        });
      }

      self.tabIndex = 0;
      this.$onInit = function() {
        self.query = {profile: self.user.username};
        self.otherProfile = Authentication.getAuthenticatedAccount().data.username !== self.user.username
      }

      self.onTabSelect = function() {
        if (self.tabIndex === 0) {
          self.forums = dynamicEntries (Forum.query, self.query)
        }
        else if (self.tabIndex === 1) {
          self.galleries = dynamicEntries(SimpleGalleryPost.query, self.query)
        }
        else if (self.tabIndex === 2) {
          //sale
          self.sales = dynamicEntries(Sale.query, self.query)
        }
        else {
          //Q&A
          self.questions = dynamicEntries(Question.query, self.query)
        }
      }
    }

})();
