(function () {
    angular.module('clientApp.component.api')
        .factory('apiFactory', function (ipcRenderer) {
            return {
                db: function (request) {
                    return new Promise(function (resolve, reject) {
                        ipcRenderer.send('dbRequest', request);                      
                        ipcRenderer.once('dbRequest-reply-' + request.db, (event, arg) => { 
                            resolve(arg);
                        });
                    });
                },
                exportData: function (data) {
                    return new Promise(function (resolve, reject) {
                        ipcRenderer.send('exportData', data);                      
                    });
                },
                loadDb: function () {
                    return new Promise(function (resolve, reject) {
                        ipcRenderer.send('loadDb'); 
                        ipcRenderer.once('loadDb-reply', (event, arg) => { 
                            resolve(arg);
                        });
                    });
                },
                clearDb: function () {
                    return new Promise(function (resolve, reject) {
                        ipcRenderer.send('clearDb'); 
                        ipcRenderer.once('clearDb-reply', (event, arg) => { 
                            resolve(arg);
                        });
                    });
                }
            }
        });
}());