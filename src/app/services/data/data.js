(function () {
	//'use strict';
	angular.module('clientApp.services.data')
			.service('dataService', dataService);

	function dataService(apiFactory) {
		var service = {
			getHeaders: getHeaders,
			neDbFilter: neDbFilter,
			getData: getData,
			padData: padData,
		};

		var startDateTime = null;
		var currentActiveTab;

		return service;

		function getHeaders(activeTab) {
			currentActiveTab = activeTab;
      var dbRequest = {
        request: { value: 1 },
        filter: { _id: 0 },
        db: activeTab + '.headers',
        action: 'get',
        pagination: false,
        sort: {index: 1}
      };

      return apiFactory.db(dbRequest).then((headers) => { 
				return neDbFilter(headers).then((stuff) => { 
					return stuff;
				});
      });
    }

    // filter for which fields to pull back    
    function neDbFilter(headers) {
      var headerFilter = {_id: 0};
      headers.forEach((header) => { 
        headerFilter[header.index] = header.value;
      });

			return getData(headerFilter, headers).then((stuff) => {
				return stuff;
			});
			
		}	
		
		function getData(headerFilter, headers) {
			var dbRequest = {
				request: {},
				db: currentActiveTab + '.data',
				action: 'get',
				filter: headerFilter
			};

			return apiFactory.db(dbRequest).then((data) => {
				return padData(data, headers);
			});
		}

		function padData(data, headers) {
      return new Promise((resolve, reject) => {
        data.forEach((element, e) => {
          headers.forEach((header, h) => { 
            if (!element[header.index]) {
              element[header.index] = '';
            }
          });
        });
				var dataObj = {};
				dataObj.data = data;
				dataObj.headers = headers;

        resolve(dataObj);
      });
		}
	}
} ())