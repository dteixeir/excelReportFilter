'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.table')
  .controller('TableCtrl', function ($routeParams, $http, $location, $window, auth) {
    var vm = this;

    // functions
    vm.getData = getData;
    vm.contains = contains;
    vm.sort = sort;
    vm.print = print;

    vm.data = getData();
    vm.indexs = angular.fromJson(window.localStorage.getItem('indexs'));
    vm.headers2 = angular.fromJson(window.localStorage.getItem('columns'));
    
    function getData() {
      return $http.get(__dirname + '/write.json').then(function(response) {
        vm.data = response.data;
        vm.data = Array.from(vm.data);
        console.log(Array.isArray(vm.data));

        console.log(typeof vm.data);
        vm.data.shift();
        console.log(vm.data.length);
      }, function() {
          throw 'There was an error getting data';
      });
    }

    function print(item) {
      console.log(item);
    }

    function sort(header) {
      console.log(header);
      return 'Cust Id';
    }

    function contains(index) {
      for (var i = 0; i < vm.indexs.length; i++) {
        if (vm.indexs[i] === index) {
          return true;
        }
      }

      return false;
    }
  });
