(function () {
  'use strict';

  angular
    .module('profile', [
      'profile.controllers',
      'profile.services'
    ]);

  angular
    .module('profile.controllers', ['ngMessages']);

  angular
    .module('profile.services', ['ngResource']);
})();
