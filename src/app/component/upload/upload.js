'use strict';

angular.module('clientApp.component.upload')
  .controller('UploadCtrl', function ($window) {

    var vm = this;
      
    $window.addEventListener('drop', function (event) {
      event.preventDefault();
      // $window.location.href = '#/settings';
    }, false);
  });