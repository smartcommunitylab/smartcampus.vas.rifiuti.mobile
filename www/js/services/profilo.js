angular.module('starter.services.profilo', [])

.factory('Profilo', function ($http, $rootScope) {
console.log('$rootScope.p: '+JSON.stringify($rootScope.p));
console.log('$rootScope.selectedProfile: '+JSON.stringify($rootScope.selectedProfile));
  return {
    aree: function() {
      return $http.get('data/db/aree.json').success(function (aree) {
        for (ai in aree) {
          var area=aree[ai];
          //$rootScope.selectedProfile;
        }
      });
    }
  }
})
