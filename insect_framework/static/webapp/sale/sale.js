(function () {
  'use strict';

  angular
    .module('sale', [
      'sale.controller',
      'sale.service',
    ]);

  angular
    .module('sale.controller', ['ngMessages']);

  angular
    .module('sale.service', ['ngResource']);
})();