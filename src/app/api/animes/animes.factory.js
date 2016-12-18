(function() {
  angular.module('clientApp.api.animes')

  .factory('animesFactory', function($http, API) {
        return {
            getAnimes : function() {
                return $http.get(API.ANIMES);
            }, 

            getEpisodes(title) {
              return $http.get(API.ANIMES + title);
            },

            getEpisode(title, id) {
              return $http.get(API.ANIMES + title + '/' + id);
            },

            updateFollowing(title) {
              return $http.put(API.ANIMES + 'following/' + title);
            },

            toggleWatchedEpisode(id) {
              return $http.put(API.EPISODES + 'watched/' + id);
            },

            setWatchedEpisode(id, boolVal) {
              return $http.put(API.EPISODES + 'watched/' + id + '/' + boolVal);
            },

            getUnseenEpisodeCount(title) {
              return $http.get(API.EPISODES + 'unseen/' + title);
            }
        }
    });

}());