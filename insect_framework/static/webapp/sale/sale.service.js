(function () {
  'use strict';

  angular
    .module('sale.service')
    .factory('Sale', Sale)
    .factory('SaleComment', SaleComment);

    Sale.$inject = ['$resource'];
    SaleComment.$inject = ['$resource'];

    function Sale ($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/sale/:id/', cfg, action);
    }

    function SaleComment($resource) {
      let cfg = {
        id: '@id'
      };

      let action = {
        post: {method: 'POST'},
        update: {method: 'PATCH'},
        delete: {method: 'DELETE'}
      }
      return $resource ('api/v1/sale-comment/:id/', cfg, action);
    }
})();
