(function () {
  'use strict';

  angular
    .module('config', ['ngResource'])
    .config(config);

  config.$inject = ['$locationProvider', '$resourceProvider'];

  /**
  * @name config
  * @desc Enable HTML5 routing so this removes # in url
  */
  function config($locationProvider, $resourceProvider) {
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }
})();
