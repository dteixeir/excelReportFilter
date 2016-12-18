(function() {
  'use strict';

  angular.module('clientApp')

  .config(function ($routeProvider, $httpProvider) {
    $httpProvider.interceptors.push('auth');
    $routeProvider
      .when('/animes', {
        templateUrl: 'app/component/usersShows/animes.html',
        controller: 'AnimesCtrl',
        controllerAs: 'vm'
      })
      .when('/allanimes', {
        templateUrl: 'app/component/allShows/allShows.html',
        controller: 'AllShowsCtrl',
        controllerAs: 'vm'
      })
      .when('/animes/:title', {
        templateUrl: 'app/component/episodeList/animeEpisodes.html',
        controller: 'AnimeEpisodesCtrl',
        controllerAs: 'vm'
      })
      .when('/animes/:title/:id', {
        templateUrl: 'app/component/episode/anime-view.html',
        controller: 'AnimeViewCtrl',
        controllerAs: 'vm'
      })
      .when('/authenticate/', {
        templateUrl: 'app/component/authenticate/authenticate.html',
        controller: 'AuthenticateCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/authenticate'
      });
  })

}());