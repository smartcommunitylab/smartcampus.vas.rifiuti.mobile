angular.module('rifiuti.services.profili', [])

.factory('Profili', function ($http, $rootScope, Raccolta) {
    var update = function() {
      read();
      var profileIndex=-1;
      if ($rootScope.selectedProfile) {
        $rootScope.profili.forEach(function(profile,pi){
          if (profile.name==$rootScope.selectedProfile.name) profileIndex=pi;
        });
      } else {
        profileIndex=0;
      }
      select(profileIndex);
    };
    var save = function() {
      localStorage.profiles=JSON.stringify($rootScope.profili);
      update();
    };
    var indexof = function(id) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].id==id) return pi;
      }
      return -1;
    };
    var byname = function(profileName) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].name==profileName) return $rootScope.profili[pi];
      }
      return null;
    };
    var read = function() {
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
    };
    var select = function(profileIndex) {
      if (!!$rootScope.selectedProfile) {
        var p=byId($rootScope.selectedProfile.id);
        if (p) p.image = "img/rifiuti_btn_radio_off_holo_dark.png";
        $rootScope.selectedProfile=null;
      }
      if (profileIndex!=-1) {
        $rootScope.profili[profileIndex].image = "img/rifiuti_btn_radio_on_holo_dark.png";
        $rootScope.selectedProfile=$rootScope.profili[profileIndex];
        localStorage.selectedProfileId = $rootScope.selectedProfile.id;
        Raccolta.aree().then(function(myAree){
          //console.log('selectedProfile: '+JSON.stringify($rootScope.selectedProfile.name));
        });
      }
    };
    var byId = function(id) {
      for (var pi=0; pi<$rootScope.profili.length; pi++) {
        if ($rootScope.profili[pi].id==id) return $rootScope.profili[pi];
      }
      return null;
    };

    
    return {
        tipidiutenza: function() {
          return $http.get('data/db/profili.json').then(function(results){
            return results.data;
          });
        },
        read : read,
        add: function(name, utenza, area) {
          if (!byname(name)) {
              var id = ""+new Date().getTime();
              var res = {
                id: id,  
                name: name,
                utenza: utenza,
                area:area
              };
              $rootScope.profili.push(res);
              save();
              return res;
          }
          return null;    
        },
        update: function(id, name, utenza, area) {
          var old = byname(name);    
          if (!old || old.id == id) {
              old = this.byId(id);
              old.name = name;
              old.area = area;
              old.utenza = utenza;
              save();
              return old;
          }
          return null;    
        },
        delete: function(id) {
          var v = $rootScope.profili;
          v.splice(indexof(id), 1);
          $rootScope.profili = v;
          save();
        },
        byId: byId,
        select : select,
        selectedProfileIndex: function() {
            return indexof(localStorage.selectedProfileId);
        }
    }
})