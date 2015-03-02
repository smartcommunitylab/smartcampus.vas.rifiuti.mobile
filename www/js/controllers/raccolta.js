angular.module('rifiuti.controllers.raccolta', [])

.controller('tipidirifiutiCtrl', function ($scope, $rootScope, Raccolta) {
  $rootScope.noteSelected = false;
  $scope.match = function (query) {
    if (query.length < 3) {
      return function (item) {
        return false;
      }
    } else {
      return function (item) {
        return item.nome.toLowerCase().indexOf(query.toLowerCase()) != -1;
        //TODO: consentire la ricerca anche sulle traduzioni
      }
    }
  };
  
  var init = function() {
    if ($scope.selectedProfile) {
      Raccolta.rifiuti().then(function(){
        Raccolta.immagini().then(function(){
          var results=[], row=[], counter=-1;
          for (var i=0; i<$scope.selectedProfile.tipologie.length; i++) {
            var tipologia=$scope.selectedProfile.tipologie[i];
            counter++;
            if (counter==3) {
              counter=0;
              results.push(row);
              row=[];
            }
            row.push({ label:tipologia, img:$scope.immagini[tipologia] });
          };
          if (row.length>0) results.push(row);
          $scope.tipologie=results;
        });
      });
    }
  };
  
  $rootScope.$watch('selectedProfile',function(a,b) {
    if (b == null || a.id != b.id) {
      init();
    }
  }); 

  init();
  
})
  
.controller('PDRCtrl', function ($scope, $rootScope, $timeout, Raccolta, $location, $stateParams) {

  $scope.profile = null;
  
  $rootScope.checkMap();  
  
  $scope.updateIMG = function () {
    $scope.variableIMG = $scope.mapView ? "img/ic_list.png" : "img/ic_map.png";
  };

//TODO: come mai in questa funzione il controllo sui CRM è diverso dalle isole ecologiche?
/*
  $scope.containsIndirizzo = function (array, item) {
    for (var k = 0; k < array.length; k++) {
      if ((array[k].id == item.dettaglioIndirizzo && item.tipologiaPuntiRaccolta == 'CRM') || (array[k].id == item.indirizzo && item.tipologiaPuntiRaccolta != 'CRM')) {
        return false;
      }
    }
    return true;
  };
*/

  $scope.openMarkerClick = function ($markerModel) {
    $location.url('/app/puntoDiRaccolta/' + $markerModel.model.id);
  };

  $scope.map = {
    control: {},
    center: {
      latitude: 46.0,
      longitude: 11.0
    },
    zoom: 8,
    pan: false,
    draggable: 'true',
    options: {
      'streetViewControl': false,
      'zoomControl': true,
      'mapTypeControl': false,
      styles: [{
        featureType: "poi",
        elementType: "labels",
        stylers: [{
          visibility: "off"
          }]
        }]
    }
  };

  $scope.click = function () {
    $scope.mapView = !$scope.mapView;
    $scope.updateIMG();
//    $timeout(function () {
//      var mapHeight = 800; // or any other calculated value
//      var mapContainer = document.querySelector('#map-container');
//      if (mapContainer) {
//        mapHeight = angular.element(mapContainer)[0].offsetHeight;
//      } else { 
//        console.log('cannot get "#map-container"');
//      }
//      var ng_mapContainer = document.querySelector('.angular-google-map-container');
//      if (ng_mapContainer) {
//        angular.element(ng_mapContainer)[0].style.height = mapHeight + 'px';
//      } else { 
//        console.log('cannot get ".angular-google-map-container"');
//      }
//    }, 200);
  };

//  $scope.$on('$viewContentLoaded', function () {
//    $timeout(function () {
//      var mapHeight = 800; // or any other calculated value
//      mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
//      angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
//    }, 50);
//  });

  var addToList = function (item, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].tipologiaPuntoRaccolta == item.tipologiaPuntiRaccolta) {
        list[i].locs.push(item);
        return;
      }
    }
    list.push({
      aperto: false,
      tipologiaPuntoRaccolta: item.tipologiaPuntiRaccolta,
      icon: item.tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_crm_grey.png' : 'img/ic_isola_eco_grey.png',
      locs: [item]
    });
  };
  
  var init = function() {
    
    $scope.mapView = true;
    $scope.id = $stateParams.id != '!' ? $stateParams.id : null;
    $scope.list = [];
    $scope.variableIMG = "img/ic_list.png";

    Raccolta.puntiraccolta().then(function(punti){
      var points = [];
      var list = [];
      punti.forEach(function(punto){
        if ($scope.id == null || punto.dettaglioIndirizzo == $scope.id) {
          var icon = {
            url: punto.tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_poi_crm.png' : 'img/ic_poi_isolaeco.png',
            scaledSize: new google.maps.Size(45, 45)
          };
          points.push({
            id: punto.dettaglioIndirizzo,
            latitude: punto.localizzazione.split(',')[0],
            longitude: punto.localizzazione.split(',')[1],
            icon: icon
          });
          addToList(punto, list);
        }
      });
      $scope.markers = {
        control: {},
        models: points,
        coords: 'self',
        fit: true,
        icon: 'icon',
        doCluster: false
      };
      $scope.list = list;
    });

  };
  
  $rootScope.$watch('selectedProfile',function(a,b) {
    if ((b == null || a.id != b.id) && a.id != $scope.profile) {
      $scope.profile = a.id;
      init();
    }
  }); 
  
  init();

})

.controller('TDRCtrl', function ($scope, $rootScope, DataManager, Raccolta, Utili) {
  $scope.icon = function(item) {
    return Utili.icon(item.tipologiaPuntoRaccolta,item.colore);
  };
  
  var init = function() {
    Raccolta.tipiDiRaccolta($rootScope.selectedProfile.utenza.tipologiaUtenza, $rootScope.selectedProfile.aree).then(function (data) {
      $scope.tipi = data;
    });
  };
  
  $rootScope.$watch('selectedProfile',function(a,b) {
    if ((b == null || a.id != b.id)) {
      init();
    }
  }); 
  
  init();

})

.controller('RaccoltaCtrl', function ($scope, $stateParams, Raccolta) {
  $scope.id = $stateParams.id;

  Raccolta.raccolta({ tipo:$scope.id }).then(function(raccolta){
    var tipirifiuto=[], tipipunto=[];
    raccolta.forEach(function(regola){
      if (tipirifiuto.indexOf(regola.tipologiaRifiuto)==-1) tipirifiuto.push(regola.tipologiaRifiuto);
      if (tipipunto.indexOf(regola.tipologiaPuntoRaccolta)==-1) tipipunto.push(regola.tipologiaPuntoRaccolta);
    });

    Raccolta.rifiuti({ tipi:tipirifiuto }).then(function(rifiuti){
      $scope.rifiuti=rifiuti;
    });

    Raccolta.raccolta({ tipipunto:tipipunto, tipirifiuto:tipirifiuto }).then(function(raccolta){
      raccolta.forEach(function(item){
        Raccolta.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
          item['punti']=punti;
        });
      });
      $scope.raccolta=raccolta;
    });
  });
})

.controller('RifiutiCtrl', function ($scope, $stateParams, Raccolta) {
  $scope.tipo = $stateParams.tipo;

  Raccolta.raccolta({ tiporifiuto:$scope.tipo }).then(function(raccolta){
    raccolta.forEach(function(item){
      Raccolta.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
        item['punti']=punti;
      });
    });
    $scope.raccolta=raccolta;
  });

  Raccolta.rifiuti({ tipo:$scope.tipo }).then(function(rifiuti){
    $scope.rifiuti=rifiuti;
  });
})
.controller('RifiutoCtrl', function ($scope, $stateParams, Raccolta) {
  $scope.nome = $stateParams.nome;

  Raccolta.rifiuto($scope.nome).then(function(rifiuto){
    if (!rifiuto) return;
    Raccolta.raccolta({ tiporifiuto:rifiuto.tipologiaRifiuto }).then(function(raccolta){
      raccolta.forEach(function(item){
        Raccolta.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
          item['punti']=punti;
        });
      });
      $scope.raccolta=raccolta;
    });
  });
})

.controller('PuntoDiRaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, Raccolta) {

  $scope.id = !!$stateParams.id && $stateParams.id != 'undefined' && $stateParams.id != 'null'? $stateParams.id : null;
  $scope.isCRM = false;
  $scope.pdr = {};
  $scope.orari = [];
  //[{giorno:"lunedì",orari:["12.00-14.00","15.30-17.30"...]}...]

  $scope.checkGiorni = function (item) {
    for (var j = 0; j < $scope.orari.length; j++) {
      if ($scope.orari[j].giorno == item) return j;
    }
    return -1;
  };
  $scope.indirizzoIfIsCRM = function () {
    if ($scope.isCRM) {
      return $scope.pdr.indirizzo;
    } else {
      return 'Area Giudicarie';
    }
  };
  
  $scope.clickNav = function() {
    if ($scope.pdr.localizzazione) window.open("http://maps.google.com?daddr="+$scope.pdr.localizzazione,"_system");
    else window.open("http://maps.google.com?daddr="+$scope.pdr.dettaglioIndirizzo,"_system");
  };
  
  Raccolta.puntiraccolta({ indirizzo:$scope.id, all:true }).then(function(punti){
    $scope.pdr = punti[0];
    if ($scope.pdr.tipologiaPuntiRaccolta == 'CRM') {
      $scope.isCRM = true;
    }
    punti.forEach(function(punto){
      punto.orarioApertura.forEach(function(orario) {
      var j = $scope.checkGiorni(orario.il);
        if (j == -1) {
          $scope.orari.push({
            giorno: orario.il,
            orari:[ orario.dalle + "-" + orario.alle ]
          });
        } else {
          if ($scope.orari[j].orari.indexOf(orario.dalle + "-" + orario.alle) == -1) {
            $scope.orari[j].orari.push(orario.dalle + "-" + orario.alle);
          }
        }
      });
    });
    Raccolta.raccolta({ tipopunto:$scope.pdr.tipologiaPuntiRaccolta }).then(function(raccolta){
      var myRifiuti=[];
      raccolta.forEach(function(regola){
        if (myRifiuti.indexOf(regola.tipologiaRaccolta)==-1) {
          myRifiuti.push(regola.tipologiaRaccolta);
        //} else { console.log('already: '+regola.tipologiaRaccolta);
        }
      });
      $scope.rifiuti=myRifiuti;
    });
  });
})