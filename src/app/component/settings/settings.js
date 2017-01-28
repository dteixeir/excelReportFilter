'use strict';

angular.module('clientApp.component.settings')
  .controller('SettingsCtrl', function ($scope, ipcRenderer, apiFactory) {
    var vm = this;

    // functions
    vm.saveHeader = saveHeader;
    vm.getSettings = getSettings;
    vm.scrubData = scrubData;
    vm.headerToggle = headerToggle;

    vm.select = select;
    vm.getTabs = getTabs;

    // Variables
    vm.activeTab = localStorage.getItem('activeTab');
    console.log(vm.activeTab);
    vm.headers = [];
    vm.worksheets = [];
    vm.setDefault = setDefault;
    vm.loadDb = loadDb;

    vm.loadDb();    
       
    
    function loadDb() {
      apiFactory.loadDb().then(() => { 
        vm.getTabs();    
        vm.setDefault(); 
        vm.getSettings();
      });
    }
    
    function setDefault() {
      vm.selectedSheet = vm.activeTab ? vm.activeTab : vm.tabs[0];
      vm.getSettings();
    }

    function getTabs() {
      var tabs = angular.fromJson(localStorage.getItem('tabs'));

      for (var key in tabs) {
        vm.worksheets.push(key);
      }
    }

    function getSettings() {
      if (vm.selectedSheet) {
        var dbRequest = {
          request: {},
          db: vm.selectedSheet + '.headers',
          action: 'get'
        };

        apiFactory.db(dbRequest).then((data) => {
          $scope.$apply(vm.headers = data);
        });
      }
    }

    function select() {
      localStorage.setItem('activeTab', vm.selectedSheet);
      vm.getSettings();
    }

    function scrubData() {
      vm.headers.forEach((element) => { 
        element.value = element.value ? 1 : 0;
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
        db: vm.selectedSheet + '.headers',
        action: 'update'
      };

      apiFactory.db(dbRequest);
    }
  });