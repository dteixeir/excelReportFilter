(function () {
    angular.module('clientApp.component.api')
        .factory('apiFactory', function (ipcRenderer) {
            return {
                getSettings: function (request) {
                    return new Promise(function (resolve, reject) {
                        ipcRenderer.send('dbRequest', request);

                        ipcRenderer.once('dbRequest-reply', (event, arg) => { 
                            resolve(arg);
                        });
                    });
                }
            }
        });
}());