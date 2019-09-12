(function () {
  'use strict';

  angular
    .module('forum.controller')
    .controller('forumController', forumController)
    .controller('forumDetailController', forumDetailController)
    .controller('manageForumController', manageForumController);

    forumController.$inject = ['Forum', '$sanitize', 'user', '$location'];
    forumDetailController.$inject = ['Forum' , '$routeParams', 'user',
                                     '$sanitize', 'Comment', '$location', 'currentForum', 'IsStaffOrAccountOwner'];
    manageForumController.$inject = ['Forum', 'currentForum', 'user', '$location'];

    function forumController (Forum, $sanitize, user, $location) {
      let self = this;
      this.limit = 15;
      this.currentPage = 1;
      this.current =1;
      this.proceed = {};
      this.currentUser = user;
      this.hasSearched = false;
      this.navigate ='forum';

      if ($location.hash()) {
        this.currentPage = $location.hash();
      }

      this.promise = Forum.query({page:this.currentPage, limit: this.limit}, (response, headerGetter) => {
        self.postCounts = (parseInt(headerGetter('X-count')));
        self.paginate = Math.ceil(self.postCounts / this.limit);
        let page = 0;
        for (let i = 0; i < self.paginate; i++) {
          if (i % 10 === 0) {
            page++;
            this.proceed[page] =[];
          }
          this.proceed[page].push(i);
        }
        self.content = response;
      });

      this.search = function (searchText) {
        this.hasSearched = true;
        this.searchQuery = {'search': searchText}
        this.promise = Forum.query({page:1, limit: this.limit, 'search' : searchText}, (response, headerGetter) => {
          self.postCounts = (parseInt(headerGetter('X-count')));
          self.paginate = Math.ceil(self.postCounts / this.limit);
          let page = 0;
          for (let i = 0; i < self.paginate; i++) {
            if (i % 10 === 0) {
              page++;
              this.proceed[page] =[];
            }
            this.proceed[page].push(i);
          }
          self.content = response;
        })
        if (!angular.isDefined(searchText)) {
          this.hasSearched = false;
          this.currentPage = 1;
        }
      }

      this.requestNext = function ($event) {
        let query = {page: $event, limit: this.limit}
        if (this.hasSearched) {
          angular.extend(query, self.searchQuery);
        }
        this.promise = Forum.query(query);
        this.currentPage =$event;
        $location.hash(this.currentPage);
      }

      this.moveToNext = function ($event) {
        this.current++;
        this.requestNext(this.proceed[this.current][0]+1);
      }

      this.moveToPrevious = function ($event) {
        this.current--;
        this.requestNext(this.proceed[this.current][0]+1);
      }
    }

    function forumDetailController (Forum, $routeParams, user ,$sanitize, Comment, $location, currentForum, IsStaffOrAccountOwner) {
      const self = this;
      self.currentUser = user;
      self.commentText = '';
      self.navigate ='forum';
      self.currentForum = currentForum;
      self.permission = function(content) {
        return IsStaffOrAccountOwner(self.currentUser, content);
      }
      self.submitComment = function() {
        let newComment = {
          content: self.commentText,
          associated_post: self.currentForum.id,
          author: self.currentUser.username
        };
        Comment.post(newComment).$promise.then((response) => {
          //$location.url('/forum/' + self.currentForum.id);
          self.commentText='';
          self.currentForum.comments.push(response);
        })
      }

      self.deleteComment = function(comment, index) {
        // need to manually remove item from DOM
        Comment.delete({id:comment.id}).$promise.then((response) => {
          self.currentForum.comments.splice(index, 1);
        });
      }
    }

    function manageForumController (Forum, currentForum, user, $location) {
      const self = this;
      self.forum = currentForum;
      self.currentUser = user;
      if (!self.forum) {
        self.forum = {
          title: "",
          content: "",
          author: self.currentUser.username,
          comments: []
        };
      }

      this.deleteForum = function() {
        Forum.delete({id:self.forum.id}).$promise.then(()=> {
          $location.url('/forum/');
        })
      }

      this.cancel = function() {
        if (currentForum) {
          $location.url('/forum/' + currentForum.id + '/');
        }
        else {
          $location.url('/forum/');
        }
      }

      this.submit = function() {
        if (self.forum.id) {
          Forum.update(self.forum).$promise.then(()=> {
            $location.url('/forum/' + self.forum.id)
          }).catch ((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
        else {
          Forum.post(self.forum).$promise.then((response) => {
            $location.url('/forum/' + response.id)
          }).catch((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
      }
    }
})();
