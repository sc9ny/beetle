(function () {
  'use strict';

  angular
    .module('forum.controller')
    .controller('forumController', forumController)
    .controller('forumDetailController', forumDetailController)
    .controller('manageForumController', manageForumController);

    forumController.$inject = ['Forum', '$sanitize', 'user'];
    forumDetailController.$inject = ['Forum' , '$routeParams', 'user',
                                     '$sanitize', 'Comment', '$location', 'IsStaffOrAccountOwner'];
    manageForumController.$inject = ['Forum', 'currentForum', 'user', '$location'];

    function forumController (Forum, $sanitize, user) {
      let self = this;
      this.limit = 12;
      this.currentPage = 1;
      this.current =1;
      this.proceed = {};
      this.currentUser = user;
      this.hasSearched = false;

      this.promise = Forum.query({page:1, limit: this.limit}, (response, headerGetter) => {
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
      console.log(searchText);
        this.promise = Forum.query({page:1, limit: this.limit, 'search' : this.searchText}, (response, headerGetter) => {
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
      }

      this.requestNext = function ($event) {
        this.promise = Forum.query({page:$event, limit:this.limit});
        this.currentPage =$event;
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

    function forumDetailController (Forum, $routeParams, user ,$sanitize, Comment, $location, IsStaffOrAccountOwner) {
      const self = this;
      self.currentUser = user;
      self.commentText = '';
      self.currentForum = Forum.get({id:$routeParams.id});
      self.permission = function(content) {
        return IsStaffOrAccountOwner(self.currentUser, content);
      }
      self.submitComment = function() {
        let newComment = {
          content: self.commentText,
          associated_post: self.currentForum.id,
          author: self.currentUser.username
        };
        Comment.post(newComment).$promise.then(() => {
          $location.url('/forum/' + self.currentForum.id);
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
