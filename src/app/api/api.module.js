(function() {
  'use strict';
  
  angular.module('clientApp.api', [
    'clientApp.api.animes',
    'clientApp.api.users',
    'clientApp.api.authenticate'
  ]);
})();