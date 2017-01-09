'use strict';

angular.module('clientApp.component.table')
  .controller('ModalCtrl', function (apiFactory, $uibModalInstance) {
    var vm = this;

    vm.cancel = cancel;
    vm.ok = ok;

    function ok() {
      $uibModalInstance.close();
    };

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    };
  });