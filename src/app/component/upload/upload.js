'use strict';

angular.module('clientApp.component.upload')
  .controller('UploadCtrl', function ($window, $scope, $rootScope) {

    var vm = this;
    
    vm.worksheets = angular.fromJson(localStorage.getItem('sheetNames'));
    vm.selectedSheet = '';
      
    $window.addEventListener('drop', function (event) {
      event.preventDefault();
      $window.location.href = '#/settings';
    }, false);
    
  });