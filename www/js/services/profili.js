angular.module('starter.services.profili', [])

.factory('Profili', function ($http, $rootScope) {
  var treeWalkUp=function(tree,parentName,results) {
    if (!parentName || parentName=="") return;
    for (i in tree) {
      var node=tree[i];
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
    }
  };

  return {
    tipidiutenza: function() {
      return $http.get('data/db/profili.json').then(function(results){
        return results.data;
      });
    },
    save: function() {
      localStorage.profiles=JSON.stringify($rootScope.p);
      this.update();
    },
    read: function() {
      if (localStorage.profiles) {
        if (localStorage.profiles.charAt(0)=='[') {
          $rootScope.p=JSON.parse(localStorage.profiles);
          for (pi in $rootScope.p) $rootScope.p[pi].image = "img/rifiuti_btn_radio_off_holo_dark.png";
        } else {
          localStorage.removeItem('profiles');
        }
      }
    },
    indexof: function(profileName) {
      for (pi in $rootScope.p) {
        if ($rootScope.p[pi].name==profileName) return pi;
      }
      return -1;
    },
    byindex: function(profileIndex) {
      if (profileIndex >= $rootScope.p.length) return null;
      return $rootScope.p[profileIndex];
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
        $rootScope.p[profileIndex].image = "img/rifiuti_btn_radio_on_holo_dark.png";
        $rootScope.selectedProfile=$rootScope.p[profileIndex];
        this.aree().then(function(myAree){
          $rootScope.selectedProfile.aree=myAree;
        });
      }
    },
    update: function() {
      this.read();
      var profileIndex=-1;
      if ($rootScope.selectedProfile) {
        for (i in $rootScope.p) {
          if ($rootScope.p[i].name==$rootScope.selectedProfile.name) profileIndex=i;
        }
      } else {
        profileIndex=0;
      }
      this.select(profileIndex);
    },
    aree: function() {
      return $http.get('data/db/aree.json').then(function (results) {
        var dbAree=results.data;
        var myAree=[];
        for (ai in dbAree) {
          var area=dbAree[ai];
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
        }
console.log('myAree: '+myAree);
        return myAree;
      });
    }
  }
})
