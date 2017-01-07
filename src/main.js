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

ipcMain.on('dbRequest', (event, arg) => {
    dbRequest(arg).then((data) => {
        event.sender.send('dbRequest-reply', data);
    });
});

dbRequest = function(arg) {
    var deferred = $q.defer();
    switch (arg.db) {
        case 'headers':
            db.headers.find(arg.request, function (err, docs) {
                deferred.resolve(docs);
            });
            break;

        default: //data
            db.data.find(arg.request, { _id: 0 })
                .sort({ 0: 1 })
                .skip(0)
                .limit(50)
                .exec(function (err, docs) {
                deferred.resolve(docs);
            });
            break;    
    }
  
  return deferred.promise;
};

// Correct Version
// dbRequest = function(arg) {
//   var deferred = $q.defer();
//   db.find(arg, function (err, docs) {
//     deferred.resolve(docs);
//   });
  
//   return deferred.promise;
// };

var Datastore = require('nedb')
var db = {};
db.data = new Datastore({ filename: __dirname + '/db/data.json' });
db.headers = new Datastore({ filename: __dirname + '/db/headers.json' });
db.data.loadDatabase();
db.headers.loadDatabase();

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