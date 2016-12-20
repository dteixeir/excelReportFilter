'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.authenticate')
  .controller('AuthenticateCtrl', function ($routeParams, $http, $location, $window, auth) {
    var vm = this;

    // functions
    vm.getData = getData;
    vm.tableStart = 4;
    vm.data = getData();    

    $window.addEventListener('dragend', function (event) {
      event.preventDefault();
      return false;
    }, false);

    function getData() {
      return $http.get(__dirname + '/write.json').then(function(response) {
        vm.data = response.data;
        vm.headers = vm.data[0];
        vm.data.shift();
      }, function() {
          throw 'There was an error getting data';
      });
    }
  });
