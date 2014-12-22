angular.module('rifiuti.controllers.raccolta', [])

.controller('tipidirifiutiCtrl', function ($scope, Profili) {
  $scope.match = function (query) {
    if (query.length < 3) {
      return function (item) {
        return false;
      }
    } else {
      return function (item) {
        return item.nome.indexOf(query) != -1;
        //TODO: consentire la ricerca anche sulle traduzioni
      }
    }
  };
  if ($scope.selectedProfile) {
    Profili.rifiuti().then(function(){
      Profili.immagini().then(function(){
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
})
  
.controller('PDRCtrl', function ($scope, $rootScope, $timeout, Profili, $location, $stateParams) {

  $scope.mapView = true;
  $scope.id = $stateParams.id != '!' ? $stateParams.id : null;
  $scope.list = [];

  $scope.variableIMG = "img/ic_list.png";
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
    $location.url('/app/puntoDiRaccolta/' + $markerModel.id);
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

  $scope.markers = {
    control: {},
    models: [],
    coords: 'self',
    fit: true,
    icon: 'icon',
    doCluster: true
  };

  $scope.click = function () {
    $scope.mapView = !$scope.mapView;
    $scope.updateIMG();
    $timeout(function () {
      var mapHeight = 800; // or any other calculated value
      mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
      angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
    }, 50);
  };

  $scope.$on('$viewContentLoaded', function () {
    $timeout(function () {
      var mapHeight = 800; // or any other calculated value
      mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
      angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
    }, 50);
  });

  $scope.addToList = function (item) {
    for (var i = 0; i < $scope.list.length; i++) {
      if ($scope.list[i].tipologiaPuntoRaccolta == item.tipologiaPuntiRaccolta) {
        $scope.list[i].locs.push(item);
        return;
      }
    }
    $scope.list.push({
      aperto: false,
      tipologiaPuntoRaccolta: item.tipologiaPuntiRaccolta,
      icon: item.tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_crm_grey.png' : 'img/ic_isola_eco_grey.png',
      locs: [item]
    });
  };

  Profili.puntiraccolta().then(function(punti){
    var points = [];
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
        $scope.addToList(punto);
      }
    });
    $scope.markers.models = points;
  });
})

.controller('TDRCtrl', function ($scope, $http) {
  $http.get('data/support/tipologieDiRaccolta.json').success(function (data) {
    $scope.tipi = data;
  });
})

.controller('RaccoltaCtrl', function ($scope, $stateParams, Profili) {
  $scope.id = $stateParams.id;
console.log('$scope.id: '+$scope.id);

  Profili.raccolta({ tipo:$scope.id }).then(function(raccolta){
    var tipirifiuto=[], tipipunto=[];
    raccolta.forEach(function(regola){
      if (tipirifiuto.indexOf(regola.tipologiaRifiuto)==-1) tipirifiuto.push(regola.tipologiaRifiuto);
      if (tipipunto.indexOf(regola.tipologiaPuntoRaccolta)==-1) tipipunto.push(regola.tipologiaPuntoRaccolta);
    });

    Profili.rifiuti({ tipi:tipirifiuto }).then(function(rifiuti){
      $scope.rifiuti=rifiuti;
    });

console.log('tipirifiuto: '+tipirifiuto);
console.log('tipipunto: '+tipipunto);
    Profili.raccolta({ tipipunto:tipipunto, tipirifiuto:tipirifiuto }).then(function(raccolta){
      raccolta.forEach(function(item){
        Profili.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
          item['punti']=punti;
        });
      });
      $scope.raccolta=raccolta;
    });
  });
})

.controller('RifiutiCtrl', function ($scope, $stateParams, Profili) {
  $scope.tipo = $stateParams.tipo;

  Profili.raccolta({ tiporifiuto:$scope.tipo }).then(function(raccolta){
    raccolta.forEach(function(item){
      Profili.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
        item['punti']=punti;
      });
    });
    $scope.raccolta=raccolta;
  });

  Profili.rifiuti({ tipo:$scope.tipo }).then(function(rifiuti){
    $scope.rifiuti=rifiuti;
  });
})
.controller('RifiutoCtrl', function ($scope, $stateParams, Profili) {
  $scope.nome = $stateParams.nome;

  Profili.rifiuto($scope.nome).then(function(rifiuto){
    if (!rifiuto) return;
    Profili.raccolta({ tiporifiuto:rifiuto.tipologiaRifiuto }).then(function(raccolta){
      raccolta.forEach(function(item){
        Profili.puntiraccolta({ tipo:item.tipologiaPuntoRaccolta }).then(function(punti){
          item['punti']=punti;
        });
      });
      $scope.raccolta=raccolta;
    });
  });
})

.controller('PuntoDiRaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, Profili) {

  $scope.id = $stateParams.id;
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
  
  Profili.puntiraccolta({ indirizzo:$scope.id, all:true }).then(function(punti){
    $scope.pdr = punti[0];
    if ($scope.pdr.tipologiaPuntiRaccolta == 'CRM') {
      $scope.isCRM = true;
    }
    punti.forEach(function(punto){
      var j = $scope.checkGiorni(punto.il);
      if (j == -1) {
        $scope.orari.push({
          giorno: punto.il,
          orari:[ punto.dalle + "-" + punto.alle ]
        });
      } else {
        if ($scope.orari[j].orari.indexOf(punto.dalle + "-" + punto.alle) == -1) {
          $scope.orari[j].orari.push(punto.dalle + "-" + punto.alle);
        }
      }
    });
    Profili.raccolta({ tipopunto:$scope.pdr.tipologiaPuntiRaccolta }).then(function(raccolta){
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