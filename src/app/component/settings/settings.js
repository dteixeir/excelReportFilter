'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.settings')
  .controller('SettingsCtrl', function ($http, $routeParams, $location, $rootScope, $window, auth) {
    var vm = this;

    console.log('rawr');

        // functions
    vm.getData = getData;
    vm.saveHeaders = saveHeaders;
    vm.saveSettings = saveSettings;

    vm.tableStart = 4;
    vm.headers = [];
    vm.headers2 = [];
    vm.indexs = [];
    vm.indexs = [];

    checkSettings();

    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
      // vm.saveHeaders();
      vm.saveSettings();
      vm.saveHeaders();
    });

    function checkSettings() {
      vm.headers2 = angular.fromJson(window.localStorage.getItem('columns'));

      if (!vm.headers2) {
        vm.getData();
      } else {
        
      }
    }

    function saveSettings() {
      window.localStorage.setItem('columns', angular.toJson(vm.headers2));
    }
        
    function getData() {
      return $http.get(__dirname + '/write.json').then(function (response) {
        vm.data = response.data;
        vm.headers = vm.data[0];
        upgradeHeaders();
        vm.data.shift();
      }, function () {
        throw 'There was an error getting data';
      });
    }
    
    function saveHeaders() {
      vm.headers2.forEach((element, i) => {
        if (element.value) {
          vm.indexs.push(i);
        }
      });

      window.localStorage.setItem('indexs', angular.toJson(vm.indexs));
    }
    
    function upgradeHeaders() {
      if (!vm.headers)
        return;  

      vm.headers2 = [];
      vm.headers.forEach((element) => {
        var item = { text: element, value: false, index: null };
        vm.headers2.push(item);
      });
    }


  });