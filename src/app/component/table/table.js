'use strict';

angular.module('clientApp.component.table')
  .controller('TableCtrl', function ($scope, $filter, apiFactory, dataService) {
    var vm = this;

    // functions
    vm.sort = sort;
    vm.getOrder = getOrder;
    vm.setFilterGroup = setFilterGroup;
    vm.getFilter = getFilter;
    vm.refresh = refresh;
    vm.exportToExcel = exportToExcel;
    vm.exportToApi = exportToApi;
    vm.convertHeadersToJson = convertHeadersToJson;
    vm.getData = getData;

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
    vm.filterData = vm.data;
    vm.getData();
    
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

    function getData() {
      dataService.getHeaders(vm.activeTab).then((data) => {
        $scope.$apply(() => {
          vm.data = data.data;
          vm.headers = data.headers;
        });
      });
    }

    function getFilter() {
      // Looks like the headers come back as numbers the first time?
      // so just addressed both of em. Fix later?
      var headerText;
      if (vm.data && !isNaN(vm.filterGroup)) {
        var header = vm.headers.find(x => x.index === vm.filterGroup);
        headerText = header.text;
        vm.filterData = $filter('filter')(vm.data, { [headerText]: vm.searchText });
      } else {
        vm.filterData = $filter('filter')(vm.data, { [vm.filterGroup]: vm.searchText });
      }
      exportToApi(vm.filterData);
      
      return vm.searchText[vm.filterGroup];
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

    function getOrder(index) {
      index = index.toString();
      if (index === vm.sortOrder)
        return 0;  
      
      if ('-' + index === vm.sortOrder)
        return 1;
      
      return 2;
    }

    function refresh(flag) {
      vm.filterGroup = '$';
      vm.searchText = '';
      vm.currentIndex = vm.all;
      vm.getData();
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

    function exportToExcel() {
      window.location.assign('db/data.xlsx');
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
  });
