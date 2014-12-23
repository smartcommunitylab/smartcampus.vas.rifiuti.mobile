angular.module('rifiuti.services.profili', [])

.factory('Profili', function ($http, $rootScope, Raccolta) {
  return {
    tipidiutenza: function() {
      return $http.get('data/db/profili.json').then(function(results){
        return results.data;
      });
    },
    save: function() {
      localStorage.profiles=JSON.stringify($rootScope.profili);
      this.update();
    },
    read: function() {
      if (localStorage.profiles) {
        if (localStorage.profiles.charAt(0)=='[') {
          $rootScope.profili=JSON.parse(localStorage.profiles);
          $rootScope.profili.forEach(function(profile){
            profile.image = "img/rifiuti_btn_radio_off_holo_dark.png";
          });
        } else {
          localStorage.removeItem('profiles');
        }
      }
    },
    indexof: function(profileName) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].name==profileName) return pi;
      }
      return -1;
    },
    byindex: function(profileIndex) {
      if (profileIndex<0 || profileIndex>=$rootScope.profili.length) return null;
      return $rootScope.profili[profileIndex];
    },
    byname: function(profileName) {
      var profileIndex=this.indexof(profileName);
      return this.byindex(profileIndex);
    },
    select: function(profileIndex) {
      if (!!$rootScope.selectedProfile) {
        var p=this.byname($rootScope.selectedProfile.name);
        if (p) p.image = "img/rifiuti_btn_radio_off_holo_dark.png";
        $rootScope.selectedProfile=null;
      }
      if (profileIndex!=-1) {
        $rootScope.profili[profileIndex].image = "img/rifiuti_btn_radio_on_holo_dark.png";
        $rootScope.selectedProfile=$rootScope.profili[profileIndex];
        Raccolta.aree().then(function(myAree){
          //console.log('selectedProfile: '+JSON.stringify($rootScope.selectedProfile.name));
        });
      }
    },
    update: function() {
      this.read();
      var profileIndex=-1;
      if ($rootScope.selectedProfile) {
        $rootScope.profili.forEach(function(profile,pi){
          if (profile.name==$rootScope.selectedProfile.name) profileIndex=pi;
        });
      } else {
        profileIndex=0;
      }
      this.select(profileIndex);
    }
  }
})