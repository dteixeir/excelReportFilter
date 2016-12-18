'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieDeleteCtrl
 * @description
 * # MovieDeleteCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.episodeList')
  .controller('AnimeEpisodesCtrl', function ($routeParams, animesFactory) {
    var vm = this;
    vm.episodeDesc = true;

    vm.title = $routeParams.title;
    vm.toggleWatched = toggleWatched;
    vm.setWatchedEpisode = setWatchedEpisode;
    vm.print = print;

    vm.toggleEpisodeOrder = toggleEpisodeOrder;

    getEpisodes();

    function toggleEpisodeOrder() {
      vm.episodeDesc = !vm.episodeDesc;
    }

    function setWatchedEpisode(id) {
      animesFactory.setWatchedEpisode(id, true).$promise;
    }

    function toggleWatched(id) {
      animesFactory.toggleWatchedEpisode(id).then(function success() {
        getEpisodes();
      });
    }

    function getEpisodes() {
      animesFactory.getEpisodes(vm.title).success(function(data) {
        vm.episodes = data;
      });
    }
  });