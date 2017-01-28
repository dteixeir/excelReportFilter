'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.table')
  .controller('TableCtrl', function ($routeParams, $scope, $filter, $location, $window, apiFactory, $uibModal) {
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
    vm.exportToExcel = exportToExcel;
    vm.exportToApi = exportToApi;
    vm.convertHeadersToJson = convertHeadersToJson;

    // variables    
    vm.dropDown = '';
    vm.data = [];
    vm.sortOrder = '0';
    vm.all = { text: '-- All --', index: '$' };
    vm.filterGroup = '$';
    vm.searchText = '';
    vm.currentIndex = vm.all;
    vm.jsonHeaders = {};
    vm.activeTab = localStorage.getItem('activeTab');

    vm.getHeaders();    
    
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
      vm.filterData = $filter('filter')(vm.data, vm.searchText[vm.filterGroup]);
      exportToApi(vm.filterData);
      
      return vm.searchText[vm.filterGroup];
    }

    function convertHeadersToJson() {
      if (!vm.headers) {
        return;
      }

      vm.jsonHeaders = {}; // reset object

      vm.headers.forEach((element) => { 
        vm.jsonHeaders[element.index] = element;
      });

      return vm.jsonHeaders;
    }

    function exportToApi(data) {
      var headers = vm.convertHeadersToJson();

      if (data.length < 1 || !vm.headers || !headers) {
        return;
      }

      // Due to naming of columns based upon index, have to convert headers to json
      // Avert you eyes... this may be ugly...
      data.forEach((row) => {
        for (var key in row) {
          if (headers[key] && headers[key].hasOwnProperty('text')) {
            row[headers[key].text] = row[key];
            delete row[key];
          }
        }
      });

      var options = [];
      vm.headers.forEach((obj) => { 
        options.push(obj.text);
      });

      apiFactory.exportData({data: data, options: options});
    }

    function exportToExcel() {
      window.location.assign('db/data.xlsx');
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
        db: vm.activeTab + '.headers',
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
        db: vm.activeTab + '.data',
        action: 'get',
        // pagination: vm.pagination,
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
  });
