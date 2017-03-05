(function() {
  'use strict';

  angular.module('clientApp')

    .config(function ($urlRouterProvider, $stateProvider, $httpProvider) {
      // $urlRouterProvider.otherwise('/upload');
      $urlRouterProvider.otherwise('/upload');
      $stateProvider

        .state('upload', {
          url: '/upload',
          templateUrl: 'app/component/upload/upload.html',
          controller: 'UploadCtrl',
          controllerAs: 'vm'
        })

        .state('settings', {
          url: '/settings',
          templateUrl: 'app/component/settings/settings.html',
          controller: 'SettingsCtrl',
          controllerAs: 'vm'
        })
      
        .state('table', {
          url: '/table',
          templateUrl: 'app/component/table/table.html',
          controller: 'TableCtrl',
          controllerAs: 'vm'
        });
      
      // .otherwise({
      //   redirectTo: '/upload'
      // });
  })

}());