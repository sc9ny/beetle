(function () {
  'use strict';

  angular
    .module('utils', ['ngMaterial'])
    .factory('dynamicEntries', dynamicEntries)
    .service('IsStaffOrAccountOwner', IsStaffOrAccountOwner)
    .filter ('range', range);
    dynamicEntries.$inject = [];
  function dynamicEntries () {
    return function (resource ,cfg) {
      cfg = cfg || {};
      if (!cfg.limit) {
        cfg.limit = 15;
      }
      return {
        length : 0,
        loadedPages : {},
        $resolved: false,
        getItemAtIndex : function (index) {
          let pageNumber = Math.max(Math.ceil(index / cfg.limit), 1);
          if (index > 0 && index % cfg.limit === 0)
            pageNumber++;
          let page = this.loadedPages[pageNumber];
          if (page) {
            return page[index % cfg.limit];
          }
          else if (page !== null) {
            this.fetchPage_(pageNumber);
          }
        },
        getLength : function () {
          if (this.length === 0)
            return cfg.limit;
          return this.length;
        },
        fetchPage_ : function (pageNumber) {
          this.loadedPages[pageNumber] = null;
          let queryParams = {
            page: pageNumber,
          };
          angular.extend(queryParams, cfg);
          this.promise = resource(queryParams, (response, headerGetter) => {
            this.length = parseInt(headerGetter('X-count'))
            this.loadedPages[pageNumber] = response;
            this.$resolved = true;
          });
        }
      }
    }
  }
  function range () {
    return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
    };
  }

  function IsStaffOrAccountOwner () {
    return function(user, content) {
      return user.is_staff || user.username === content.author;
    }
  }
})();
