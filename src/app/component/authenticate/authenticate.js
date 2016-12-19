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
    vm.submit = submit;
    vm.print = print;
    vm.getData = getData;
    vm.stuff;


    $window.addEventListener('dragend', function (event) {
      event.preventDefault();
      return false;
    }, false);


    function submit() {
      vm.auth = {
        username: vm.username,
        password: vm.password
      };
    }

    function print() {
      getData();
    }

    function getData() {
      $http.get(__dirname + '/write.json').then(function(response) {
        vm.stuff = response.data;
      }, function() {
          throw 'There was an error getting data';
      });
    }
  });
