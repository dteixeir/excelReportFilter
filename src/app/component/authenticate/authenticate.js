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
    vm.print = print;
    vm.contains = contains;
    vm.table = false;

    vm.tableStart = 4;
    vm.headers2 = [];
    vm.indexs = [];

    vm.data = getData();
    

    $window.addEventListener('dragend', function (event) {
      event.preventDefault();
      return false;
    }, false);

    function getData() {
      return $http.get(__dirname + '/write.json').then(function(response) {
        vm.data = response.data;
        vm.headers = vm.data[0];
        upgradeHeaders();
        vm.data.shift();
      }, function() {
          throw 'There was an error getting data';
      });
    }

    function upgradeHeaders() {
      vm.headers.forEach((element) => {
        var item = { text: element, value: false, index: null };
        vm.headers2.push(item);
      });
    }

    function print() {
      vm.headers2.forEach((element) => {
        if (element.index) {
          vm.indexs.push(element.index);
        }
      });
      vm.table = true;
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
