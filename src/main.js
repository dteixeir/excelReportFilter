// Handle Squirrel events for Windows immediately on start
if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const os = require('os');
const $q = require('q');

const logger = require('winston');
var ipcMain = require('electron').ipcMain;

// ipcMain.ipcMain.on('dbRequest', (event, arg) => {
//     console.log('main');
//     dbRequest(arg).then((data) => {
//         ipcMain.ipcMain.once('dbRequest-reply', data);

//     });

//     ipcMain.ipcMain.removeAllListeners();

// });

    ipcMain.on('dbRequest', (event, arg) => {
        console.log('main');
        dbRequest(arg).then((data) => {
            event.sender.send('dbRequest-reply', data);
        });
    });




dbRequest = function(arg) {
  var deferred = $q.defer();
  db.find(arg, function (err, docs) {
    deferred.resolve(docs);
  });
  
  return deferred.promise;
};

var Datastore = require('nedb')
var db = new Datastore({ filename: __dirname + '/write.json' });
db.loadDatabase(function (err) {    // Callback is optional
// Now commands will be executed

});

// Keep reference of main window because of GC
var mainWindow = null;

// Quit when all windows are closed
app.on('window-all-closed', function() {
	app.quit();
});

// When application is ready, create application window
app.on('ready', function() {
    // Create main window
    // Other options available at:
    // http://electron.atom.io/docs/latest/api/browser-window/#new-browserwindow-options
    mainWindow = new BrowserWindow({
        name: "ea-todo",
        width: 1000,
        height: 600,
        toolbar: true
    });

    mainWindow.webContents.openDevTools();
    // Target HTML file which will be opened in window
    mainWindow.loadURL('file://' + __dirname + "/index.html");

    // Uncomment to use Chrome developer tools
    // mainWindow.webContents.openDevTools({detach:true});

    // Cleanup when window is closed
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});