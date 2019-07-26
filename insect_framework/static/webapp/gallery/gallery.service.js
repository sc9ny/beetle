function transformImageRequest(data) {
    if (data === undefined)
      return data;
    var fd = new FormData();
    angular.forEach(data, function(value, key) {
      if (value instanceof FileList) {
        if (value.length == 1) {
          fd.append(key, value[0]);
        } else {
          angular.forEach(value, function(file, index) {
            fd.append(key + '_' + index, file);
          });
        }
      } else {
        fd.append(key, value);
      }
    });
    return fd;
}


(function () {
  'use strict';

  angular.module('gallery.service')
  .factory('Gallery', Gallery)
  .factory('GalleryPost', GalleryPost);

  function Gallery ($resource) {
    let action = {
      save : {
        'method' : 'POST',
        'transformRequest': transformImageRequest,
        'headers' : {'Content-Type': undefined},
        isArray: true
      }
    }

    return $resource('/api/v1/gallery/:id/', {id: '@id'}, action)
  }

  function GalleryPost ($resource) {
    return $resource('/api/v1/gallery-post/:id/', {id: '@id'})
  }

})();