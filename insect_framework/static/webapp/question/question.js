(function () {
  'use strict';

  angular
    .module('question', [
      'question.controller',
      'question.service',
    ]);

  angular
    .module('question.controller', ['ngMessages']);

  angular
    .module('question.service', ['ngResource']);
})();