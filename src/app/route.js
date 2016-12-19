(function() {
  'use strict';

  angular.module('clientApp')

  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('auth');
    $routeProvider
      .when('/authenticate/', {
        templateUrl: 'app/component/authenticate/authenticate.html',
        controller: 'AuthenticateCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/authenticate'
      });
  })

}());