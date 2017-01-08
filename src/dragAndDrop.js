(function () {  
  const xlsx = require('xlsx');
  var fs = require('fs');
  var util = require('util');
  var Datastore = require('nedb')

  var db = {};
  db.data = new Datastore({ filename: __dirname + '/db/data.json' });
  db.headers = new Datastore({ filename: __dirname + '/db/headers.json' });
  db.data.loadDatabase();
  db.headers.loadDatabase();


  document.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
  }, false);

  document.addEventListener('drop', function (event) {
    event.preventDefault();

      file = event.dataTransfer.files;
      
      if (file.length == 1) {
        var fileName = file[0].name;
        
        if (checkFileType(fileName)) {

          fs.writeFile(__dirname + '/settings.json', util.format('{}', ''));

          var settings = {
            filePath: file[0].path,
            fileName: file,
            columnHeaders: []
          }

          fs.writeFile(__dirname + '/settings.json', util.format('%j', settings));

          readFile(file[0].path);
        }
      }

    return false;
  }, false);
    
  function readFile(filePath) {
    try {
      let file = xlsx.readFile(filePath);
      let name = file.SheetNames;
      let data = file.Sheets['ICSW Detail'];
      data = xlsx.utils.sheet_to_row_object_array(data, { header: 1 });

      filterData(data);   

    } catch (err) {
      console.log(err.message);
    }
  }

  function filterData(data) {
    upgradeHeaders(data[0]);
    data.shift();
    changeData(data);
  }

  function upgradeHeaders(data) {
    if (!data)
      return;  

    var headers2 = [];
    data.forEach((element, i) => {
      var item = { text: element, value: 0, index: i };
      headers2.push(item);
    });
  
     db.headers.insert(headers2, function (err, newDocs) {
      console.log(err); 
    });
  }

  function changeData(data) {
    var newData = [];

    data.forEach((row, i1) => {
      var newRow = {};
      
      row.forEach((cell, i2) => {
        newRow[i2] = cell.trim();
      });

      newData.push(newRow);
    });
   
    db.data.insert(newData, function (err, newDocs) {
      console.log(err); 
    });
  }

  function checkFileType(fileName) {
    var nameParts = fileName.split('.');
    return nameParts[nameParts.length - 1] === 'xlsx';
  }


})();