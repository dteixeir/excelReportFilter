(function () {  
  const xlsx = require('xlsx');
  var fs = require('fs');
  var util = require('util');
  var xlsxj = require("xlsx-to-json");

  document.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
  }, false);

  document.addEventListener('drop', function (event) {
    event.preventDefault();

    for (let f of event.dataTransfer.files) {
      // console.log('File(s) you dragged here: ', f.path)
      readFile(f.path);
    }

    return false;
  }, false);
    
  function readFile(filePath) {
    try {
      let file = xlsx.readFile(filePath);
      let name = file.SheetNames;
      let data = file.Sheets['ICSW Detail'];
      data = xlsx.utils.sheet_to_row_object_array(data, { header: 1 });

      writeFile(data);

    } catch (err) {
      console.log(err.message);
    }
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

})();