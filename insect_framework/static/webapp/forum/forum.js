(function () {
  'use strict';

  angular
    .module('forum', [
      'forum.controller',
      'forum.service',
      'textAngular',
      'ngSanitize'
    ]);

  angular
    .module('forum.controller', ['ngMessages']);

  angular
    .module('forum.service', ['ngResource']);
})();
