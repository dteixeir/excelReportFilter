'use strict';

angular.module('clientApp.component.allShows')
  .controller('AllShowsCtrl', function (animesFactory) {
    
    // variables
    var vm = this;

    // function routing
    vm.toggleFollow = toggleFollow;

    getAnimes();

    function toggleFollow(title) {
      animesFactory.updateFollowing(title).then(function success() {
        getAnimes();
      });
    }

    function getAnimes() {
      animesFactory.getAnimes().success(function(data) {
        vm.animes = data;
      });
    }

  });


