'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.authenticate')
  .controller('AuthenticateCtrl', function ($routeParams, $http, $location, $window, authenticateFactory, auth) {
    var vm = this;

    // functions
    vm.submit = submit;

    $window.addEventListener('dragend', function (event) {
      console.log('-------------------------------------------');
      event.preventDefault();
      return false;
    }, false);


    function submit() {

      vm.auth = {
        username: vm.username,
        password: vm.password
      };

      authenticateFactory.authenticateUser(vm.auth).then(function(data){
        $window.localStorage.setItem("token", data.data.token);
        $location.path('/animes');
      });
      
    }
  });
