(function() {
  'use strict';

  angular.module('clientApp')

  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('auth');
    $routeProvider

      .when('/upload', {
        templateUrl: 'app/component/upload/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'vm'
      })

      .when('/settings', {
        templateUrl: 'app/component/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'vm'
      })
      
      .when('/table', {
        templateUrl: 'app/component/table/table.html',
        controller: 'TableCtrl',
        controllerAs: 'vm'
      })   
      
      .otherwise({
        redirectTo: '/upload'
      });
  })

}());