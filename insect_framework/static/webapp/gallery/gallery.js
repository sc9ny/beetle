(function () {
  'use strict';

  angular
    .module('gallery', [
      'gallery.controller',
      'gallery.service',
    ]);

  angular
    .module('gallery.controller', ['ngMessages']);

  angular
    .module('gallery.service', ['ngResource']);
})();