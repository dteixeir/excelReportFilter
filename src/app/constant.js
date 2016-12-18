(function() {
  'use strict';

  var port = 8080;

  angular.module('clientApp')
    .constant("API", {
      "ANIMES": "http://localhost:" + port + "/animes/",
      "EPISODES": "http://localhost:" + port + "/episode/",
      "USERS": "http://localhost:" + port + "/users/",
      "AUTHENTICATE": "http://localhost:" + port + "/authenticate/",
    });
})();