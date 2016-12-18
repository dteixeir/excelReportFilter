(function() {
  angular.module('clientApp.api.authenticate')

  .factory('authenticateFactory', function($http, API) {
        return {
            authenticateUser : function(user) {
                return $http({
                    url: API.AUTHENTICATE,
                    method: 'POST',
                    data: user
                });
            }
        }
    });

}());