(function() {
  'use strict'; 

  angular.module('clientApp.filter')
    .filter('trusted', function ($sce) {
      return function(url) {
        return $sce.trustAsResourceUrl(url);
      };
    });
})();