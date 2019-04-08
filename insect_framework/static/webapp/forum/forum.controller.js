(function () {
  'use strict';

  angular
    .module('forum.controller')
    .controller('forumController', forumController);

    forumController.$inject = ['Forum'];

    function forumController (Forum) {
      self = this;
      this.limit = 12;

      this.promise = Forum.query({page:1, limit: this.limit}, (response, headerGetter) => {
        self.postCounts = (parseInt(headerGetter('X-count')));
        self.paginate = Math.ceil(self.postCounts / this.limit);
      });
    }
})();
