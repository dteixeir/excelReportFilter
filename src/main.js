// Handle Squirrel events for Windows immediately on start
if(require('electron-squirrel-startup')) return;

const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const {autoUpdater} = electron;
const os = require('os');
const $q = require('q');
const Datastore = require('nedb');
const json2xls = require('json2xls');
const fs = require('fs');

const logger = require('winston');
var ipcMain = require('electron').ipcMain;

ipcMain.on('dbRequest', (event, arg) => {
    dbRequest(arg).then((data) => {
        event.sender.send('dbRequest-reply-' + arg.db, data);
    });
});

ipcMain.on('exportData', (event, arg) => {
    exportData(arg);
});

dbRequest = function (arg) {
    var deferred = $q.defer();
    var db = getDb(arg.db);

    switch (arg.action) {
        case 'get':
            var query = db.find(arg.request, arg.filter).sort(arg.sort);
            if (arg.pagination) {
                query = query.skip(0).limit(50);
            } 
            query.exec(function (err, docs) {
                console.log(err);
                deferred.resolve(docs);
            });
            break;
            
        case 'update':
            db.update(arg.request, arg.filter, { multi: false }, function (err, docs) {
                console.log(err);
                deferred.resolve(docs);
            });
            break;
    }
    return deferred.promise;
}

getDb = function (db) {
    switch (db) {
        case 'headers':
            return _db.headers;
            
        case 'data':
            return _db.data;    
    }
}

exportData = function (data) {
    var xls = json2xls(data);
    fs.writeFileSync(__dirname + '/db/data.xlsx', xls, 'binary');
}

var _db = {};
_db.data = new Datastore({ filename: __dirname + '/db/data.json' });
_db.headers = new Datastore({ filename: __dirname + '/db/headers.json' });
_db.data.loadDatabase();
_db.headers.loadDatabase();

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