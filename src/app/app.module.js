(function() {
  'use strict';

  // Ionic App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'app' is the name of this angular module (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  angular.module('clientApp', [
    'ngRoute',
    'ngResource',
    'clientApp.component',
    'clientApp.api',
    'clientApp.directive',
    'clientApp.filter'
  ]);

}());