(function () {
  angular.module('sale.controller')
  .controller('saleController', saleController)
  .controller('saleDetailController', saleDetailController)
  .controller('manageSaleController', manageSaleController);

  saleController.$inject =['user', 'Sale', '$sanitize'];
  saleDetailController.$inject = ['Sale' , '$routeParams', 'user',
                                     '$sanitize', 'SaleComment', '$location', 'IsStaffOrAccountOwner'];
  manageSaleController.$inject = ['Sale', 'currentForum', 'user', '$location'];

  function saleController (user, Sale, $sanitize) {
    let self = this;
      this.limit = 15;
      this.currentPage = 1;
      this.current =1;
      this.proceed = {};
      this.currentUser = user;
      this.hasSearched = false;
      this.navigate ='sale';

      this.promise = Sale.query({page:1, limit: this.limit}, (response, headerGetter) => {
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
        this.promise = Sale.query({page:1, limit: this.limit, 'search' : searchText}, (response, headerGetter) => {
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
        this.promise = Sale.query(query);
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

  function saleDetailController(Sale , $routeParams, user, $sanitize, SaleComment, $location, IsStaffOrAccountOwner) {
    const self = this;
      self.currentUser = user;
      self.commentText = '';
      self.navigate ='sale';
      self.currentForum = Sale.get({id:$routeParams.id});
      self.permission = function(content) {
        return IsStaffOrAccountOwner(self.currentUser, content);
      }
      self.submitComment = function() {
        let newComment = {
          content: self.commentText,
          associated_sale: self.currentForum.id,
          author: self.currentUser.username
        };
        SaleComment.post(newComment).$promise.then((response) => {
          //$location.url('/forum/' + self.currentForum.id);
          self.commentText='';
          self.currentForum.comments.push(response);
        })
      }

      self.deleteComment = function(comment, index) {
        // need to manually remove item from DOM
        SaleComment.delete({id:comment.id}).$promise.then((response) => {
          self.currentForum.comments.splice(index, 1);
        });
      }
  }

  function manageSaleController(Sale, currentForum, user, $location) {
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
        Sale.delete({id:self.forum.id}).$promise.then(()=> {
          $location.url('/sale/');
        })
      }

      this.submit = function() {
        if (self.forum.id) {
          Sale.update(self.forum).$promise.then(()=> {
            $location.url('/sale/' + self.forum.id)
          }).catch ((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
        else {
          Sale.post(self.forum).$promise.then((response) => {
            $location.url('/sale/' + response.id)
          }).catch((error) => {
            self.errorMessage = error.data.content[0];
          });
        }
      }
  }

})();