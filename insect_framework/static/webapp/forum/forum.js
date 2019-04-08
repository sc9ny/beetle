(function () {
  'use strict';

  angular
    .module('forum', [
      'forum.controller',
      'forum.service',
    ]);

  angular
    .module('forum.controller', ['ngMessages']);

  angular
    .module('forum.service', ['ngResource']);
})();
