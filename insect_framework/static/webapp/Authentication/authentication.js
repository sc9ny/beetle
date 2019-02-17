(function () {
  'use strict';

  angular
    .module('authentication', [
      'authentication.controllers',
      'authentication.services'
    ]);

  angular
    .module('authentication.controllers', ['ngMessages']);

  angular
    .module('authentication.services', ['ngCookies']);
})();
