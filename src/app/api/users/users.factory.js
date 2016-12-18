(function() {
  angular.module('clientApp.api.users')

  .factory('usersFactory', function($http, API) {
        return {
            getUsers : function() {
                return $http.get(API.USERS);
            }
        }
    });

}());