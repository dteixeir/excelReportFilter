'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.table')
  .controller('TableCtrl', function ($routeParams, $scope, $filter, $location, $window, auth, apiFactory) {
    var vm = this;

    // functions
    vm.getData = getData;
    vm.sort = sort;
    vm.getOrder = getOrder;
    vm.setFilterGroup = setFilterGroup;
    vm.getFilter = getFilter;
    vm.refresh = refresh;
    vm.getHeaders = getHeaders;
    vm.neDbFilter = neDbFilter;
    vm.padData = padData;
    vm.exportData = exportData;

    vm.dropDown = '';
    vm.data = [];
    vm.sortOrder = '0';
    vm.all = { text: '-- All --', index: '$' };
    
    vm.filterGroup = '$';
    vm.searchText = '';
    vm.currentIndex = vm.all;
    vm.pagination = false;
    vm.page = 1;

    vm.getHeaders();    
    // vm.indexs.unshift({ index: '$', text: '-- All --' });
    
    // $ matches against all sub objects - requires special functionality to put it in a select statement
    function setFilterGroup(header) {
      if (header == '$') {
        vm.filterGroup = '$';
        vm.currentIndex = vm.all;
      } else {
        vm.currentIndex = {text: header.text, index: header.index};
        vm.filterGroup = header.index;
      }
    }

    function getFilter() {
      return vm.searchText[vm.filterGroup];
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
      vm.currentIndex = vm.all;
    }

    function getHeaders() {
      var dbRequest = {
        request: { value: 1 },
        filter: { _id: 0 },
        db: 'headers',
        action: 'get',
        pagination: false,
        sort: {index: 1}
      };

      apiFactory.db(dbRequest).then((data) => { 
        vm.headers = data;
        vm.neDbFilter(data);
      });
    }

    // filter for which fields to pull back    
    function neDbFilter() {
      var headerFilter = {_id: 0};
      vm.headers.forEach((header) => { 
        headerFilter[header.index] = header.value;
      });

      vm.getData(headerFilter);
    }

    // get data from db    
    function getData(headerFilter) {
      var dbRequest = {
        request: {},
        db: 'data',
        action: 'get',
        pagination: vm.pagination,
        filter: headerFilter
      };

      apiFactory.db(dbRequest).then((data) => {
        vm.padData(data);
        
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

    // Takes care of blank data    
    function padData(data) {
      data.forEach((element, e) => {
        vm.headers.forEach((header, h) => { 
          if (!element[header.index]) {
            element[header.index] = '';
          }
        });
      });
      $scope.$apply(vm.data = data);
    }

    function exportData() {
      vm.filterData = $filter('filter')(vm.data, vm.getFilter());
      apiFactory.exportData(vm.filterData);
    }
  });
