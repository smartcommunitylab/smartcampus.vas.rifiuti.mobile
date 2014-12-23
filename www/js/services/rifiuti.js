angular.module('rifiuti.services.rifiuti', [])

.factory('Raccolta', function ($http, $rootScope, $q, $cordovaGeolocation, Utili) {
  var treeWalkUp=function(tree,parentName,key,results) {
    if (!parentName || parentName=="") return;
    tree.forEach(function(node){
      if (node[key]==parentName) {
        var utenzaOK=true;
        if (node.utenzaDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza domestica") utenzaOK=false;
        if (node.utenzaNonDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza non domestica") utenzaOK=false;
        if (node.utenzaOccasionale=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza occasionale") utenzaOK=false;
        if (utenzaOK) {
          results.push(node[key]);
        }
        treeWalkUp(tree,node.parent,key,results);
      }
    });
  };

  return {
    aree: function() {
      return $http.get('data/db/aree.json').then(function (results) {
        var myAree=[],myComuni=[];
        if ($rootScope.selectedProfile) {
          results.data.forEach(function(area,ai,dbAree){
            if (area.localita==$rootScope.selectedProfile.loc) {
              var utenzaOK=true;
              if (area.utenzaDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza domestica") utenzaOK=false;
              if (area.utenzaNonDomestica=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza non domestica") utenzaOK=false;
              if (area.utenzaOccasionale=="False" && $rootScope.selectedProfile.utenza.tipologiaUtenza=="utenza occasionale") utenzaOK=false;
              if (utenzaOK) {
                myAree.push(area.localita);
                if (area.comune!=$rootScope.selectedProfile.loc) myAree.push(area.comune);
                myComuni.push(area.comune);
              }
              treeWalkUp(dbAree,area.parent,'nome',myAree);
              treeWalkUp(dbAree,area.parent,'comune',myComuni);
            }
          });
          $rootScope.selectedProfile.aree=myAree;
          $rootScope.selectedProfile.comuni=myComuni;
        }
        return myAree;
      });
    },
    puntiraccolta: function(options) {
      var ptdeferred = $q.defer();
      this.aree().then(function(myAree){
        $http.get('data/db/puntiRaccolta.json').then(function (results) {
          var myPunti=[];
          var myPuntiDone=[];
          if ($rootScope.selectedProfile) {
            results.data.forEach(function(punto,pi,dbPunti){
              var optionsOK=true;
              if (options && options.indirizzo && punto.dettaglioIndirizzo!=options.indirizzo) optionsOK=false;
              if (options && options.tipo && punto.tipologiaPuntiRaccolta!=options.tipo) optionsOK=false;
              if (optionsOK && $rootScope.selectedProfile.aree.indexOf(punto.area)!=-1 && (punto.tipologiaPuntiRaccolta=='CRM' || $rootScope.selectedProfile.comuni.indexOf(punto.indirizzo)!=-1) && punto.tipologiaUtenza==$rootScope.selectedProfile.utenza.tipologiaUtenza) {
                if (myPuntiDone.indexOf(punto.dettaglioIndirizzo)==-1) {
                  var extcheckOK=true;
                  if (punto.gettoniera!="" && punto.gettoniera!="True" && punto.residuo!="" && punto.residuo!="True" && punto.tipologiaPuntiRaccolta=="Residuo") extcheckOK=false;
                  if (punto.imbCarta!="" && punto.imbCarta!="True" && punto.tipologiaPuntiRaccolta=="Carta, cartone e cartoni per bevande") extcheckOK=false;
                  if (punto.imbPlMet!="" && punto.imbPlMet!="True" && punto.tipologiaPuntiRaccolta=="Imballaggi in plastica e metallo") extcheckOK=false;
                  if (punto.imbVetro!="" && punto.imbVetro!="True" && punto.tipologiaPuntiRaccolta=="Imballaggi in vetro") extcheckOK=false;
                  if (punto.organico!="" && punto.organico!="True" && punto.tipologiaPuntiRaccolta=="Organico") extcheckOK=false;
                  if (punto.indumenti!="" && punto.indumenti!="True" && punto.tipologiaPuntiRaccolta=="Indumenti usati") extcheckOK=false;
                  if (extcheckOK) {
                    myPunti.push(punto);
                    if (!options || !options.all) myPuntiDone.push(punto.dettaglioIndirizzo);
                  }
                //} else { console.log('already: '+punto.dettaglioIndirizzo); 
                }
              }
            });
          }

          $cordovaGeolocation.getCurrentPosition({ timeout:10000,enableHighAccuracy:true }).then(function (position) {
            position={ coords:{ latitude:'46.0', longitude:'11.0' } };

            if (position.coords && position.coords.latitude && position.coords.longitude) {
              myPunti.forEach(function(punto){
                if (punto.localizzazione) {
                  var distance=$rootScope.distance([position.coords.latitude,position.coords.longitude],punto.localizzazione.split(','));
                  punto['distance']=distance;
                } else {
                  console.log('invalid location for: '+punto.dettaglioIndirizzo);
                }
              });
            } else {
              console.log('invalid pos: '+JSON.stringify(position));
            }
          }, function(err) {
            console.log('cannot geolocate!');
          });
          
          ptdeferred.resolve(myPunti);
        });
      });
      return ptdeferred.promise;
    },
    raccolta: function(options) {
      var deferred = $q.defer();
      this.aree().then(function(myAree){
        $http.get('data/db/raccolta.json').then(function (results) {
          var myRaccolta=[];
          if ($rootScope.selectedProfile) {
            results.data.forEach(function(regola,ri,dbRaccolta){
              var optionsOK=true;
              if (options && options.tipo && regola.tipologiaRaccolta!=options.tipo) optionsOK=false;

              if (options && options.tiporifiuto && regola.tipologiaRifiuto!=options.tiporifiuto) optionsOK=false;
              if (options && options.tipirifiuto && options.tipirifiuto.indexOf(regola.tipologiaRifiuto)) optionsOK=false;

              if (options && options.tipopunto && regola.tipologiaPuntoRaccolta!=options.tipopunto) optionsOK=false;
              if (options && options.tipipunto && options.tipipunto.indexOf(regola.tipologiaPuntoRaccolta)==-1) optionsOK=false;

              if (optionsOK && $rootScope.selectedProfile.aree.indexOf(regola.area)!=-1 && regola.tipologiaUtenza==$rootScope.selectedProfile.utenza.tipologiaUtenza) {
                var icona = Utili.iconFromRegola(regola);
                if (icona) regola['icon'] = icona;
                myRaccolta.push(regola);
              }
            });
          }
          deferred.resolve(myRaccolta);
        });
      });
      return deferred.promise;
    },
    rifiuto: function(nome) {
      return this.rifiuti().then(function(myRifiuti){
        var myRifiuto=null;
        myRifiuti.forEach(function(rifiuto){
          if (rifiuto.nome==nome) myRifiuto=rifiuto;
        });
        return myRifiuto;
      });
    },
    rifiuti: function(options) {
      var deferred = $q.defer();
      this.aree().then(function(myAree){
        $http.get('data/db/riciclabolario.json').then(function (results) {
          var myTipologie=[];
          var myRifiuti=[];
          if ($rootScope.selectedProfile) {
            results.data.forEach(function(rifiuto,ri,dbRifiuti){
              var optionsOK=true;
              if (options && options.tipo && rifiuto.tipologiaRifiuto!=options.tipo) optionsOK=false;
              if (options && options.tipi && options.tipi.indexOf(rifiuto.tipologiaRifiuto)==-1) optionsOK=false;
              if (optionsOK && $rootScope.selectedProfile.aree.indexOf(rifiuto.area)!=-1 && rifiuto.tipologiaUtenza==$rootScope.selectedProfile.utenza.tipologiaUtenza) {
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
      return $http.get('data/support/tipologiaRifiutoImmagini.json').then(function (results) {
        var imgs={};
        results.data.forEach(function(immagine,ii,dbImmagini){
          imgs[immagine.valore]=immagine.immagine;
        });
        $rootScope.immagini=imgs;
        return imgs;
      });
    }
  }
})
