(function() {
  angular.module('clientApp')

  .factory('auth', function($q, $injector, $window) {
    var interceptor = {
      request: request
    };

    var token = null;

    return interceptor;

    function request(config) {
      config.headers.token = $window.localStorage.getItem("token");
  
      return config;
    }
  });

})();