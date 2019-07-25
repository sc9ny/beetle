(function () {
  'use strict';

  angular.module('gallery.controller')
  .controller('galleryController', galleryController)
  .controller('galleryManageController', galleryManageController);

  galleryController.$inject = ['user'];
  galleryManageController.$inject = ['user', '$scope'];

  function galleryController(user) {
    console.log('galleryCon')
  }

  function galleryManageController(user, $scope) {
    $scope.imageUpload = function(event){
      var steps= [];
      var isLastFile = false;

      for(var i = 0 ; i < event.target.files.length ; i++){
        console.log('File array log :' + event.target.files[i].name);
        var reader = new FileReader();
        reader.onload = function(e){
          $scope.$apply(function(){
            steps.push(e.target.result);
            if(isLastFile){
              $scope.steps = steps;
              console.log($scope.steps);
            }
          })
        }
        if(i == event.target.files.length - 1){
          isLastFile  = true;
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }


//    const self = this;
//    this.images = [];
//    $scope.selectFile = function (e) {
//      angular.forEach(e.target.files, (file) => {
//        let reader = new FileReader();
//        reader.onload = function(e) {
//          self.images.push(e.target.result);
//          $scope.$apply();
//        };
//        reader.readAsDataURL(e.target.files[0]);
//      })
//
//    }
  }
})();

//<html>
//<head>
//    <title></title>
//</head>
//<body>
//    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.9/angular.min.js"></script>
//    <script type="text/javascript">
//        var app = angular.module('MyApp', [])
//        app.controller('MyController', function ($scope) {
//            $scope.SelectFile = function (e) {
//                var reader = new FileReader();
//                reader.onload = function (e) {
//                    $scope.PreviewImage = e.target.result;
//                    $scope.$apply();
//                };
//
//                reader.readAsDataURL(e.target.files[0]);
//            };
//        });
//    </script>
//    <div ng-app="MyApp" ng-controller="MyController">
//        <input type="file" onchange="angular.element(this).scope().SelectFile(event)" />
//        <hr />
//        <img ng-src="{{PreviewImage}}" ng-show="PreviewImage != null" alt="" style="height:200px;width:200px" />
//     </div>
//</body>
//</html>