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

    // functions
    vm.getData = getData;
    vm.saveHeaders = saveHeaders;
    vm.saveSettings = saveSettings;
    vm.checkSettings = checkSettings;

    vm.headers = [];
    vm.indexs = [];

    checkSettings();

    $rootScope.$on("$locationChangeStart", function(event, next, current) { 
      vm.saveSettings();
      vm.saveHeaders();
    });

    function checkSettings() {
      vm.headers = angular.fromJson(window.localStorage.getItem('columns'));

      if (!vm.headers) {
        vm.getData();
      }
    }

    function saveSettings() {
      window.localStorage.setItem('columns', angular.toJson(vm.headers));
    }
        
    function getData() {
      return $http.get(__dirname + '/write.json').then(function (response) {
        vm.data = response.data.data;
        vm.headers = response.data.headers;
      }, function () {
        throw 'There was an error getting data';
      });
    }
    
    function saveHeaders() {
      vm.headers.forEach((element) => {
        if (element.value) {
          vm.indexs.push(element);
        }
      });

      window.localStorage.setItem('indexs', angular.toJson(vm.indexs));
    }
  });