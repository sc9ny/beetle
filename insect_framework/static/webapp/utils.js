(function () {
  'use strict';

  angular
    .module('utils', ['ngMaterial'])
    .factory('dynamicEntries', dynamicEntries);
dynamicEntries.$inject = [];
  function dynamicEntries (resource, cfg) {
    cfg = cfg || {};
    if (!cfg.limit) {
      cfg.limit = 15;
    }
    return function () {
      size: 0;
      loadedPages: {};
      getItemAtIndex: function (index) {
        let pageNumber = Math.ceil(index / cfg.limit);
        let page = this.loadedPages[pageNumber];
        if (page) {
          return page[index % cfg.limit];
        }
        else if (page !== null) {
          this.fetchPage_(pageNumber);
        }
      };
      getLength: function () {
        return this.size;
      };
      fetchPage_: function (pageNumber) {
        this.loadedPages[pageNumber] = null;
        let queryParams = {
          page: pageNumber,
        };
        angular.extend(queryParams, cfg);
        this.promise = resource(cfg, (response, headerGetter) => {
          this.size = parseInt(headerGetter('X-count'))
          this.loadedPages[pageNumber] = response;
        });
      };
    }
  }
})();
