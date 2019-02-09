let mainApp = angular.module('mainApp, []').
  controller('mainController', mainController);

  mainController = function ($scope) {
    $scope.message = "HELLO!";
  };
