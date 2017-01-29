(function () {  
  const xlsx = require('xlsx');
  var fs = require('fs');
  var util = require('util');
  var Datastore = require('nedb');

  var db = {};
  var tabs = [];

  document.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
  }, false);

  document.addEventListener('drop', function (event) {
    event.preventDefault();
      clearDb();
      file = event.dataTransfer.files;
      
      if (file.length == 1) {
        var fileName = file[0].name;
        
        if (checkFileType(fileName)) {
          readFile(file[0].path);
        }
      }

    return false;
  }, false);
    
  function readFile(filePath) {
    try {
      let file = xlsx.readFile(filePath);
      let name = file.SheetNames;

      for (var i = 0; i < file.SheetNames.length; i++) {
        let data = file.Sheets[file.SheetNames[i]];
        data = xlsx.utils.sheet_to_row_object_array(data, { header: 1 });
        filterData(data, file.SheetNames[i]); 
      }
      
      setTabs(tabs);

    } catch (err) {
      if (err) throw err;
    }
  }

  function setTabs(tabs) {
    var obj = {};

    tabs.forEach((tab) => {
      obj[tab] = 0;
    });

    localStorage.setItem('tabs', JSON.stringify(obj));
  }

  function filterData(data, dbName) {
    upgradeHeaders(data[0], dbName);
    data.shift();
    changeData(data, dbName);
  }

  function upgradeHeaders(data, dbName) {
    if (!data || data.length <= 0)
      return;  
    
    
    var headers2 = [];
    data.forEach((element, i) => {
      var item = { text: element, value: 0, index: i };
      headers2.push(item);
    });

    tabs.push(dbName);    
    createDb(dbName + '.headers', headers2);
  }

  function createDb(dbName, data) {
    if (data.length <= 0)
      return;  

    db[dbName] = new Datastore({ filename: __dirname + '/db/' + dbName + '.json' });
    db[dbName].loadDatabase();
    db[dbName].insert(data, function (err, newDocs) {
      if (err) throw err;
    });
  }

  function changeData(data, dbName) {
    var newData = [];

    data.forEach((row, i1) => {
      var newRow = {};
      
      row.forEach((cell, i2) => {
        newRow[i2] = cell.trim();
      });

      newData.push(newRow);
    });
   
    createDb(dbName + '.data', newData);
  }

  function checkFileType(fileName) {
    var nameParts = fileName.split('.');
    return nameParts[nameParts.length - 1] === 'xlsx';
  }

  function clearDb() {
    fs.readdir(__dirname + '/db/', (err, files) => {
      files.forEach((file) => {
        fs.unlink(__dirname + '/db/' + file, (err) => {
          if (err) throw err;
        });
      });
    });
  }

})();