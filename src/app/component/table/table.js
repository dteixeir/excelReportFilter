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
    vm.changeData = changeData;
    vm.getFilter = getFilter;

    vm.dropDown = '';
    vm.newData = [];
    vm.data = [];
    vm.sortOrder = '0';
    
    vm.filterGroup = '$';
    vm.currentIndex = 0;    
    vm.searchText = '';

    getData();
    vm.indexs = angular.fromJson(window.localStorage.getItem('indexs'));
    vm.indexs.unshift({ index: '$', text: 'All' });

    vm.headers2 = angular.fromJson(window.localStorage.getItem('columns'));
    
    // $ matches against all sub objects - requires special functionality to put it in a select statement
    function setFilterGroup(groupIndex) {
      if (groupIndex == '$') {
        vm.filterGroup = '$';
        vm.currentIndex = 0;
      } else {
        vm.currentIndex = groupIndex + 1;
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

    // get data from local file    
    function getData() {
      return $http.get(__dirname + '/write.json').then(function(response) {
        vm.data = response.data;
        vm.data.shift();
        vm.changeData();
      }, function() {
          throw 'There was an error getting data';
      });
    }

    // Change data to Array of Jsons    
    function changeData() {
      vm.data.forEach((row, i1) => {
        var newRow = {};
        
        row.forEach((cell, i2) => {
          newRow[i2] = cell;
        });

        vm.newData.push(newRow);
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
          return true;
        }
      }

      return false;
    }
  });
