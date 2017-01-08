'use strict';

angular.module('clientApp.component.settings')
  .controller('SettingsCtrl', function ($http, $scope, $routeParams, $location, $rootScope, $window, auth, ipcRenderer, apiFactory) {
    var vm = this;

    // functions
    vm.saveHeader = saveHeader;
    vm.getSettings = getSettings;
    vm.scrubData = scrubData;
    vm.headerToggle = headerToggle;

    vm.headers = [];

    vm.getSettings();

    function scrubData() {
      vm.headers.forEach((element) => { 
        if (element.value) {
          element.value = 1;
        } else {
          element.value = 0;
        }
      });
    }

    function getSettings() {
      var dbRequest = {
        request: {},
        db: 'headers',
        action: 'get'
      };

      apiFactory.db(dbRequest).then((data) => {
        $scope.$apply(vm.headers = data);
      });
    }

    function headerToggle(header) {
      header.value = header.value ? 1 : 0;
      vm.saveHeader(header);
    }
    
    function saveHeader(header) {
      var dbRequest = {
        request: { _id: header._id },
        filter: { $set: { value: header.value } },
        db: 'headers',
        action: 'update'
      };

      apiFactory.db(dbRequest);
    }
  });