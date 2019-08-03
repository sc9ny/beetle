(function () {
  'use strict';

  angular
    .module('question.service')
    .factory('Question', Question)
    .factory('Answer', Answer);

    Question.$inject = ['$resource'];
    Answer.$inject = ['$resource'];

    function Question ($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/question/:id/', cfg, action);
    }

    function Answer($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/answer/:id/', cfg, action);
    }
})();
