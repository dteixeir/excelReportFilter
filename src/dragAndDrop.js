(function () {  
  const xlsx = require('xlsx');
  var fs = require('fs');
  var util = require('util');

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
      // writeFile(newData);

    } catch (err) {
      console.log(err.message);
    }
  }

  function filterData(data) {
    var headers = upgradeHeaders(data[0]);
    data.shift();
    var data = changeData(data);

    var newDataObject = {
      "headers": headers,
      "data": data
    };

    writeFile(newDataObject);
  }

  function upgradeHeaders(data) {
    if (!data)
      return;  

    var headers2 = [];
    data.forEach((element, i) => {
      var item = { text: element, value: false, index: i };
      headers2.push(item);
    });
  
    return headers2;
  }

  function changeData(data) {
    var newData = [];

    data.forEach((row, i1) => {
      var newRow = {};
      
      row.forEach((cell, i2) => {
        newRow[i2] = cell;
      });

      newData.push(newRow);
    });

    return newData;
  }

  function writeFile(data) {
    fs.writeFile(__dirname + '/write.json', util.format('{}', ''));
    fs.writeFile(__dirname + '/write.json', util.format('%j', data), function () {
      loadData();
    });
  }

  function loadData() {
    this.data = JSON.parse(fs.readFileSync(__dirname + '/write.json', 'utf8'));
  }

  function checkFileType(fileName) {
    var nameParts = fileName.split('.');
    return nameParts[nameParts.length - 1] === 'xlsx';
  }

})();