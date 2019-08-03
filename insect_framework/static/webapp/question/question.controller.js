(function () {
  angular.module('question.controller')
  .controller('questionController', questionController)
  .controller('questionDetailController', questionDetailController)
  .controller('manageQuestionController', manageQuestionController);

  questionController.$inject =['user', 'Question', '$sanitize'];
  questionDetailController.$inject = ['Question' , '$routeParams', 'user',
                                     '$sanitize', 'Answer', '$location', 'IsStaffOrAccountOwner'];
  manageQuestionController.$inject = ['Question', 'currentForum', 'user', '$location'];

  function questionController (user, Question, $sanitize) {
    let self = this;
      this.limit = 15;
      this.currentPage = 1;
      this.current =1;
      this.proceed = {};
      this.currentUser = user;
      this.hasSearched = false;
      this.navigate ='question';

      this.promise = Question.query({page:1, limit: this.limit}, (response, headerGetter) => {
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
      console.log(searchText)
        this.hasSearched = true;
        this.searchQuery = {'search': searchText}
        this.promise = Question.query({page:1, limit: this.limit, 'search' : searchText}, (response, headerGetter) => {
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
        this.promise = Question.query(query);
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

  function questionDetailController(Question , $routeParams, user, $sanitize, Answer, $location, IsStaffOrAccountOwner) {
    const self = this;
      self.currentUser = user;
      self.commentText = '';
      self.navigate ='question';
      self.currentForum = Question.get({id:$routeParams.id});
      self.permission = function(content) {
        return IsStaffOrAccountOwner(self.currentUser, content);
      }
      self.submitComment = function() {
        let newAnswer = {
          content: self.commentText,
          associated_question: self.currentForum.id,
          author: self.currentUser.username
        };
        Answer.post(newAnswer).$promise.then((response) => {
          //$location.url('/forum/' + self.currentForum.id);
          self.commentText='';
          self.currentForum.comments.push(response);
        })
      }

      self.deleteComment = function(comment, index) {
        // need to manually remove item from DOM
        Answer.delete({id:comment.id}).$promise.then((response) => {
          self.currentForum.comments.splice(index, 1);
        });
      }
  }

  function manageQuestionController(Question, currentForum, user, $location) {
    const self = this;
    console.log('here')
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
        Question.delete({id:self.forum.id}).$promise.then(()=> {
          $location.url('/question/');
        })
      }

      this.submit = function() {
        if (self.forum.id) {
          Question.update(self.forum).$promise.then(()=> {
            $location.url('/question/' + self.forum.id)
          }).catch ((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
        else {
          Question.post(self.forum).$promise.then((response) => {
            $location.url('/question/' + response.id)
          }).catch((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
      }
  }

})();