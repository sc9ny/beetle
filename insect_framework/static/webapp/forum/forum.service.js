(function () {
  'use strict';

  angular
    .module('forum.service')
    .factory('Forum', Forum);

    Forum.$inject = ['$resource'];

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
})();
