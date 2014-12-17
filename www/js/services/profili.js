angular.module('rifiuti.services.profili', [])

.factory('Profili', function ($http, $rootScope, $q) {
  var treeWalkUp=function(tree,parentName,results) {
    if (!parentName || parentName=="") return;
    tree.forEach(function(node){
      if (node.nome==parentName) {
        var utenzaOK=true;
        if (node.utenzaDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza domestica") utenzaOK=false;
        if (node.utenzaNonDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza non domestica") utenzaOK=false;
        if (node.utenzaOccasionale=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza occasionale") utenzaOK=false;
        if (utenzaOK) {
          results.push(node.nome);
        }
        treeWalkUp(tree,node.parent,results);
      }
    });
  };

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
        this.rifiuti().then(function(myRifiuti){
          $rootScope.selectedProfile.rifiuti=myRifiuti;
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
    },
    aree: function() {
      return $http.get('data/db/aree.json').then(function (results) {
        var myAree=[];
        if ($rootScope.selectedProfile) {
          results.data.forEach(function(area,ai,dbAree){
            if (area.localita==$rootScope.selectedProfile.loc) {
              var utenzaOK=true;
              if (area.utenzaDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza domestica") utenzaOK=false;
              if (area.utenzaNonDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza non domestica") utenzaOK=false;
              if (area.utenzaOccasionale=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza occasionale") utenzaOK=false;
              if (utenzaOK) {
                myAree.push($rootScope.selectedProfile.loc);
                if (area.comune!=$rootScope.selectedProfile.loc) myAree.push(area.comune);
              }
              treeWalkUp(dbAree,area.parent,myAree);
            }
          });
          $rootScope.selectedProfile.aree=myAree;
console.log('$rootScope.selectedProfile.aree: '+$rootScope.selectedProfile.aree);
        }
        return myAree;
      });
    },
    rifiuti: function() {
      var deferred = $q.defer();
      this.aree().then(function(myAree){
        $http.get('data/db/riciclabolario.json').then(function (results) {
          var myTipologie=[];
          var myRifiuti=[];
          if ($rootScope.selectedProfile) {
            results.data.forEach(function(rifiuto,ri,dbRifiuti){
              if ($rootScope.selectedProfile.aree.indexOf(rifiuto.area) && rifiuto.tipologiaUtenza==$rootScope.selectedProfile.utenza.tipologiaUtenza) {
                myRifiuti.push(rifiuto);
                if (myTipologie.indexOf(rifiuto.tipologiaRifiuto)==-1) myTipologie.push(rifiuto.tipologiaRifiuto);
              }
            });
            $rootScope.selectedProfile.rifiuti=myRifiuti;
            $rootScope.selectedProfile.tipologie=myTipologie.sort();
          }
          deferred.resolve(myRifiuti);
        })
      });
      return deferred.promise;
    },
    immagini: function() {
      var imgDeferred = $q.defer();
      this.rifiuti().then(function(){
        $http.get('data/support/tipologiaRifiutoImmagini.json').then(function (results) {
          var imgs={};
          results.data.forEach(function(immagine,ii,dbImmagini){
            imgs[immagine.valore]=immagine.immagine;
          });
          $rootScope.immagini=imgs;
          imgDeferred.resolve(imgs);
        })
      });
      return imgDeferred.promise;
    }
  }
})
