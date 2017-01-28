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
var _db = {};

ipcMain.on('dbRequest', (event, arg) => {
  if (isEmpty(_db)) {
    loadDb().then(() => {
      dbRequest(arg).then((data) => {
        event.sender.send('dbRequest-reply-' + arg.db, data);
      });
    });
  } else {
    dbRequest(arg).then((data) => {
      event.sender.send('dbRequest-reply-' + arg.db, data);
    });
  }
});

isEmpty = function(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

ipcMain.on('exportData', (event, arg) => {
  exportData(arg);
});

ipcMain.on('loadDb', (event, arg) => {
  if (isEmpty(_db)) {
    loadDb().then(() => { 
      event.sender.send('loadDb-reply');
    });
  } else {
    event.sender.send('loadDb-reply');
  }
});

loadDb = function () {
  var deferred = $q.defer();
  fs.readdir(__dirname + '/db/', (err, files) => {
    files.forEach((file, i) => {
      _db[file] = new Datastore({ filename: __dirname + '/db/' + file });
      _db[file].loadDatabase();
      if (files.length - 1 == i) {
        deferred.resolve();
      }
    });
  });
  return deferred.promise;
}

dbRequest = function (arg) {
  var deferred = $q.defer();
  var db = _db[arg.db + '.json'];

  switch (arg.action) {
      case 'get':
          var query = db.find(arg.request, arg.filter).sort(arg.sort);
          query.exec(function (err, docs) {
              if (err) throw err;
              deferred.resolve(docs);
          });
          break;
          
      case 'update':
          db.update(arg.request, arg.filter, { multi: false }, function (err, docs) {
              if (err) throw err;
              deferred.resolve(docs);
          });
          break;
  }
  return deferred.promise;
}

exportData = function (data) {
    if (!data.data || !data.options) {
        return;
    }

    var xls = json2xls(data.data, {fields: data.options});
    fs.writeFileSync(__dirname + '/db/data.xlsx', xls, 'binary');
}

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