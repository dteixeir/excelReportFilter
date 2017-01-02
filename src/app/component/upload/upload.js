'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.upload')
  .controller('UploadCtrl', function ($routeParams, $http, $location, $window, auth) {
    var vm = this;

    console.log('shit');   

    $window.addEventListener('drop', function (event) {
      event.preventDefault();
      $window.location.href = '#/settings';
    }, false);

    
  });