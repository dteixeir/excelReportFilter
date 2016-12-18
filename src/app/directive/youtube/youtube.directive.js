(function() {
'use strict';  
  
  angular.module('clientApp.directive')
    .directive('youtube', function() {
      return {
        restrict: 'E',
        scope: {
          src: '='
        },
        templateUrl: 'directive/youtube/youtube.html'
      };
  });
})();