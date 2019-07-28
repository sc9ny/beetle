(function () {
  'use strict';

  angular.module('gallery.controller')
  .controller('galleryController', galleryController)
  .controller('galleryManageController', galleryManageController)
  .controller('galleryDetailController', galleryDetailController);

  galleryController.$inject = ['user', 'GalleryPost'];
  galleryManageController.$inject = ['user', '$scope', 'Gallery', 'GalleryPost', '$location'];
  galleryDetailController.$inject = ['user', 'currentGallery', 'GalleryComment', 'IsStaffOrAccountOwner'];

  function galleryController(user, GalleryPost) {
    const self = this;
    this.hasSearched = false;
    this.limit =15;
    this.currentPage = 1;
    this.current =1;
    this.proceed = {};
    this.currentUser = user;
    this.promise = GalleryPost.query({page:1, limit: this.limit}, (response, headerGetter) => {
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

    this.search = function(searchText) {
      this.hasSearched = true;
      this.searchQuery = {'search': searchText};
        this.promise = GalleryPost.query({page:1, limit: this.limit, 'search' : searchText}, (response, headerGetter) => {
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
      let query = {page: $event, limit: this.limit};
      if (this.hasSearched) {
        angular.extend(query, this.searchQuery)
      }
      this.promise = GalleryPost.query(query);
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

  function galleryDetailController(user, currentGallery, GalleryComment, IsStaffOrAccountOwner) {
    const self = this;
    this.currentUser = user;
    this.currentGallery = currentGallery;
    this.selectedImage = this.currentGallery.photos[0]
    this.slideIndex = 0;
    this.commentText = '';

    this.showSlides = function() {
      var captionText = document.getElementById("caption");
      if (this.slideIndex > this.currentGallery.photos.length-1) {
        this.slideIndex = 0;
      }
      if (this.slideIndex < 0) {this.slideIndex = this.currentGallery.photos.length-1}
      //captionText.innerHTML = dots[$scope.slideIndex-1].alt;
      this.selectedImage = this.currentGallery.photos[this.slideIndex];
    }
    this.plusSlides = function(n) {
     this.slideIndex += n;
      this.showSlides();
    }

    // Thumbnail image controls
    this.currentSlide = function(n) {
      this.previousIndex =this.slideIndex;
      this.slideIndex = n
      this.showSlides();
    }

    this.submitComment = function() {
      let newComment = new GalleryComment({comment: self.commentText, gallery_post: self.currentGallery.id})
      newComment.$save().then((response) => {
        self.currentGallery.comments.push(response);
        this.commentText = '';
      });
    }

    self.deleteComment = function(comment, index) {
      // need to manually remove item from DOM
      GalleryComment.delete({id:comment.id}).$promise.then((response) => {
        self.currentGallery.comments.splice(index, 1);
      });
    }

    this.permission = function(content) {
      return IsStaffOrAccountOwner(self.currentUser, content);
    }
  }


  function galleryManageController(user, $scope, Gallery, GalleryPost, $location) {
    $scope.slideIndex = 0;
    $scope.previousIndex = undefined;
    $scope.files =[];
    $scope.newGalleryPost = new GalleryPost({
      title: ''
    });

    $scope.upload = function() {
      $scope.newGalleryPost.$save().then(response => {
        for (let i = 0; i < $scope.files.length; i++) {
          $scope.files[i].gallery_post = response.id
          let gallery = new Gallery ($scope.files[i])
          gallery.$save();
        }
        $location.url('/gallery/'+response.id+'/');
      }, (error) => {
        $scope.error = 'Error in processing images.'
      });

    }

    $scope.showSlides = function() {
      var captionText = document.getElementById("caption");
      if ($scope.slideIndex > $scope.steps.length-1) {
        $scope.slideIndex = 0;
      }
      if ($scope.slideIndex < 0) {$scope.slideIndex = $scope.steps.length-1}
      //captionText.innerHTML = dots[$scope.slideIndex-1].alt;
      $scope.selectedImage = $scope.steps[$scope.slideIndex];
    }
    $scope.imageUpload = function(event){
      var steps= [];
      var isLastFile = false;

      for(var i = 0 ; i < event.target.files.length ; i++){
        var reader = new FileReader();
        reader.onload = function(e){
          $scope.$apply(function(){
            steps.push(e.target.result);
            if(isLastFile){
              $scope.steps = steps;
              $scope.showSlides(0);
            }
          })
        }
        if(i == event.target.files.length - 1){
          isLastFile  = true;
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    if ($scope.steps)
        $scope.showSlides(0);

    // Next/previous controls
    $scope.plusSlides = function(n) {
     $scope.slideIndex += n;
      $scope.showSlides();
    }

    // Thumbnail image controls
    $scope.currentSlide = function(n) {
      $scope.previousIndex =$scope.slideIndex;
      $scope.slideIndex = n
      $scope.showSlides();
    }
  }
})();

angular.module('gallery.controller').directive('ngFileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.ngFileModel);
            var isMultiple = attrs.multiple;
            var modelSetter = model.assign;
            element.bind('change', function () {
                var values = [];
                angular.forEach(element[0].files, function (item) {
                    var value = {
                        image: item,
                        description: '',
                        gallery_post: undefined,
                    };
                    values.push(value);
                });
                scope.$apply(function () {
                    if (isMultiple) {
                        modelSetter(scope, values);
                    } else {
                        modelSetter(scope, values[0]);
                    }
                });
            });
        }
    };
}]);