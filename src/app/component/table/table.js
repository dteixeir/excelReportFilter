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
    vm.getOrder = getOrder;
    vm.setFilterGroup = setFilterGroup;
    vm.getFilter = getFilter;
    vm.refresh = refresh;

    vm.dropDown = '';
    vm.data = [];
    vm.sortOrder = '0';
    
    vm.refresh();

    getData();
    vm.indexs = angular.fromJson(window.localStorage.getItem('indexs'));
    vm.indexs.unshift({ index: '$', text: '-- All --' });

    vm.headers = angular.fromJson(window.localStorage.getItem('columns'));
    
    // $ matches against all sub objects - requires special functionality to put it in a select statement
    function setFilterGroup(groupIndex) {
      if (groupIndex == '$') {
        vm.filterGroup = '$';
        vm.currentIndex = { text: '-- All --', index: '$' };
      } else {
        vm.currentIndex = contains(groupIndex);
        vm.filterGroup = groupIndex;
      }
    }

    function getFilter() {
      return { [vm.filterGroup]: vm.searchText };
    }

    function getOrder(index) {
      index = index.toString();
      if (index === vm.sortOrder)
        return 0;  
      
      if ('-' + index === vm.sortOrder)
        return 1;
      
      return 2;
    }

    function refresh() {
      vm.filterGroup = '$';
      vm.searchText = '';
      vm.currentIndex = { text: '-- All --', index: '$' };
    }

    // get data from local file    
    function getData() {
      return $http.get(__dirname + '/write.json').then(function(response) {
        vm.data = response.data.data;
      }, function() {
          throw 'There was an error getting data';
      });
    }

    // sort toggle logic    
    function sort(index) {
      index = index.toString();
      if (index == vm.sortOrder) {
        vm.sortOrder = '-' + index;
      } else {
        vm.sortOrder = index;
      }
    }

    // check for index in index array of checked headers    
    function contains(index) {
      for (var i = 0; i < vm.indexs.length; i++) {
        if (vm.indexs[i].index === index) {
          return vm.indexs[i];
        }
      }

      return null;
    }
  });
