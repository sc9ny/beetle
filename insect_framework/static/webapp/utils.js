(function () {
  'use strict';

  angular
    .module('utils', ['ngMaterial'])
    .factory('dynamicEntries', dynamicEntries)
    .service('IsStaffOrAccountOwner', IsStaffOrAccountOwner)
    .filter ('range', range)
    .component('search', {
      templateUrl: '/static/webapp/search.html',
      bindings: {
        onChange: '&',
        onClear: '&?',
        focus: '<?',
        disabled: '<?'
      },
      controller: function($element) {
        this.$onChange = function(changes) {
          if(changes.focus && changes.focus.currentValue) {
            $element.find('input').focus();
          }
        };

        this.clearSearch = function() {
          this.searchText ='';
          this.onChange({seachText: ''});
          if (angular.isFunction(this.onClear)) {
            this.onClear();
          }
        }
      }
    });
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
          allLoaded: [],
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
                this.allLoaded = this.allLoaded.concat(response);
                this.$resolved = true;
            });
          },
          updateCfg: function(newCfg) {
            angular.extend(cfg, newCfg);
          },
          resetParams: function() {
            this.$resolved = false;
            this.loadedPages= {};
            this.length = 0;
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

  function IsStaffOrAccountOwner (Authentication, $location) {
    return function(user, content) {
      if (!angular.isDefined(user) && Authentication.isAuthenticated()) {
        console.log(user);
        Authentication.logout();
        $location.url('/login/')
      }
      if (!angular.isDefined(user)) {
        return false;
      }
      return user.is_staff || user.username === content.author;
    }
  }

})();
