'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MovieViewCtrl
 * @description
 * # MovieViewCtrl
 * Controller of the clientApp
 */
angular.module('clientApp.component.episode')
  .controller('AnimeViewCtrl', function ($routeParams, animesFactory) {
    var vm = this;
    //vm.nextEpisode = nextEpisode;
    vm.episodeList;


    animesFactory.getEpisode($routeParams.title, $routeParams.id).success(function(data) {
      vm.episode = data;

      vm.previousEpisode = vm.episode.EpisodeNumber - 1;
      vm.nextEpisode = vm.episode.EpisodeNumber + 1;
      
    }).then(function() {
      getEpisodes();
    });

    function getEpisodes() {
      animesFactory.getEpisodes(vm.episode.Title).success(function(data) {
        vm.episodeList = data;
        
        vm.previousEpisode = selectWhere(vm.episodeList, "EpisodeNumber", vm.previousEpisode);
        vm.nextEpisode = selectWhere(vm.episodeList, "EpisodeNumber", vm.nextEpisode);
      });
    }

    function selectWhere(data, propertyName, value) {
      for (var i = 0; i < data.length; i++) {
        if (data[i][propertyName] === value) 
          return data[i];
      }
      return null;
    }
  });
