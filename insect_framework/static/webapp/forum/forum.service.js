(function () {
  'use strict';

  angular
    .module('forum.service')
    .factory('Forum', Forum)
    .factory('Comment', Comment);

    Forum.$inject = ['$resource'];
    Comment.$inject = ['$resource'];

    function Forum ($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'}
      }
      return $resource ('api/v1/post/:id/', cfg, action);
    }

    function Comment ($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {methpd: 'POST'},
        update: {method: 'PATCH'}
      }
      return $resource ('api/v1/comment/:id/', cfg, action);
    }
})();
