angular.module('starter.controllers.raccolta', [])

.controller('PDRCtrl', function ($scope, $rootScope, $timeout, $http, $location, $stateParams) {

  $scope.mapView = true;

  $scope.id = $stateParams.id != '!' ? $stateParams.id : null;

  $scope.list = [];

  $scope.variableIMG = "img/ic_list.png";

  $scope.updateIMG = function () {
    $scope.variableIMG = $scope.mapView ? "img/ic_list.png" : "img/ic_map.png";
  };

  $scope.init = function () {
    $http.get('data/db/puntiRaccolta.json').success(function (loc) {
      var profilo = $rootScope.selectedProfile.loc;
      var points = [];
      for (var i = 0; i < loc.length; i++) {
        var indirizzo = loc[i].dettaglioIndirizzo != "" ? loc[i].dettaglioIndirizzo : loc[i].indirizzo;
        if (loc[i].area == profilo && loc[i].indirizzo.indexOf(profilo) != -1 && $scope.containsIndirizzo(points, loc[i]) && ($scope.id == null || indirizzo == $scope.id)) {
          var icon = {
            url: loc[i].tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_poi_crm.png' : 'img/ic_poi_isolaeco.png',
            scaledSize: new google.maps.Size(45, 45)
          };
          points.push({
            id: loc[i].dettaglioIndirizzo != '' ? loc[i].dettaglioIndirizzo : loc[i].indirizzo,
            latitude: loc[i].localizzazione.split(',')[0],
            longitude: loc[i].localizzazione.split(',')[1],
            icon: icon
          });
          $scope.addToList(loc[i]);
        }
      }
      $scope.markers.models = points;
    });
  };

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

  $scope.containsIndirizzo = function (array, item) {
    for (var k = 0; k < array.length; k++) {
      if ((array[k].id == item.dettaglioIndirizzo && item.tipologiaPuntiRaccolta == 'CRM') || (array[k].id == item.indirizzo && item.tipologiaPuntiRaccolta != 'CRM')) {
        return false;
      }
    }
    return true;
  };

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

  $scope.init();
})

.controller('TDRCtrl', function ($scope, $http) {
  $scope.v = [];
  $scope.readJson = function () {
    $http.get('data/support/tipologieDiRaccolta.json').success(function (data) {
      $scope.v = data;
    });
  };
  $scope.readJson();
})

.controller('RaccoltaCtrl', function ($scope, $rootScope, $stateParams, $ionicNavBarDelegate, $http) {

  $scope.id = $stateParams.id;

  $scope.rifiuti = [];

  $scope.locs = [];

  $scope.readJson = function () {
    $http.get('data/db/riciclabolario.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].tipologiaRifiuto == $scope.id) {
          $scope.rifiuti.push(data[i]);
        }
      }
    });
    $http.get('data/db/raccolta.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].tipologiaRifiuto == $scope.id) {
          $scope.locs.push(data[i]);
        }
      }
      for (var i = 0; i < $scope.locs.length; i++) {
        $scope.locs[i].aperto = false;
        $scope.locs[i].locs = [];
      }
      $http.get('data/db/puntiRaccolta.json').success(function (loc) {
        var profilo = $rootScope.selectedProfile.loc;
        for (var i = 0; i < loc.length; i++) {
          if (loc[i].area == profilo && loc[i].indirizzo.indexOf(profilo) != -1) {
            for (var j = 0; j < $scope.locs.length; j++) {
              if ($scope.locs[j].tipologiaPuntoRaccolta == loc[i].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.locs[j].locs, loc[i])) {
                $scope.locs[j].locs.push(loc[i]);
              }
            }
          }
        }
      });
      $http.get('data/support/tipologieDiRaccolta.json').success(function (group) {
        for (var i = 0; i < $scope.locs.length; i++) {
          for (var j = 0; j < group.length; j++) {
            if ($scope.locs[i].tipologiaRifiuto == group[j].name) {
              $scope.locs[i].icon = group[j].icons[i];
            }
          }
        }
      });
    });
  };

  $scope.containsIndirizzo = function (array, item) {
    for (var k = 0; k < array.length; k++) {
      if (array[k].indirizzo == item.indirizzo) {
        return false;
      }
    }
    return true;
  };

  $scope.readJson();
})

.controller('RifiutoCtrl', function ($scope, $rootScope, $stateParams, $ionicNavBarDelegate, $http) {
  //////////////////
  $scope.id = $stateParams.id;

  $scope.rifiuti = [];

  $scope.locs = [];

  $scope.readJson = function () {
    $http.get('data/db/riciclabolario.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].tipologiaRifiuto == $scope.id) {
          $scope.rifiuti.push(data[i]);
        }
      }
    });
    $http.get('data/db/raccolta.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].tipologiaRifiuto == $scope.id) {
          $scope.locs.push(data[i]);
        }
      }
      for (var i = 0; i < $scope.locs.length; i++) {
        $scope.locs[i].aperto = false;
        $scope.locs[i].locs = [];
      }
      $http.get('data/db/puntiRaccolta.json').success(function (loc) {
        var profilo = $rootScope.selectedProfile.loc;
        for (var i = 0; i < loc.length; i++) {
          if (loc[i].area == profilo && loc[i].indirizzo.indexOf(profilo) != -1) {
            for (var j = 0; j < $scope.locs.length; j++) {
              if ($scope.locs[j].tipologiaPuntoRaccolta == loc[i].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.locs[j].locs, loc[i])) {
                $scope.locs[j].locs.push(loc[i]);
              }
            }
          }
        }
      });
      $http.get('data/support/tipologieDiRaccolta.json').success(function (group) {
        for (var i = 0; i < $scope.locs.length; i++) {
          for (var j = 0; j < group.length; j++) {
            if ($scope.locs[i].tipologiaRifiuto == group[j].name) {
              $scope.locs[i].icon = group[j].icons[i];
            }
          }
        }
      });
    });
  };

  $scope.containsIndirizzo = function (array, item) {
    for (var k = 0; k < array.length; k++) {
      if (array[k].indirizzo == item.indirizzo) {
        return false;
      }
    }
    return true;
  };

  $scope.readJson();
  ///////////////////////////// forse bisogna togliere delle cose

  $scope.id = $stateParams.id;

  $scope.back = function () {
    $ionicNavBarDelegate.$getByHandle('navBar').back();
  };

  $scope.v = [];

  $scope.readJson = function () {
    $http.get('data/db/riciclabolario.json').success(function (base) {
      for (var i = 0; i < base.length; i++) {
        if (base[i].nome == $scope.id) {
          $http.get('data/db/raccolta.json').success(function (data) {
            for (var k = 0; k < data.length; k++) {
              if (data[k].tipologiaRifiuto == base[i].tipologiaRifiuto) {
                $scope.v.push(data[k]);
              }
            }
            for (var k = 0; k < $scope.v.length; k++) {
              $scope.v[k].aperto = false;
              $scope.v[k].locs = [];
            }
            $http.get('data/db/puntiRaccolta.json').success(function (loc) {
              var profilo = $rootScope.selectedProfile.loc;
              for (var k = 0; k < loc.length; k++) {
                if (loc[k].area == profilo && loc[k].indirizzo.indexOf(profilo) != -1) {
                  for (var j = 0; j < $scope.v.length; j++) {
                    if ($scope.v[j].tipologiaPuntoRaccolta == loc[k].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.v[j].locs, loc[k])) {
                      $scope.v[j].locs.push(loc[k]);
                    }
                  }
                }
              }
            });
            $http.get('data/support/tipologieDiRaccolta.json').success(function (group) {
              for (var i = 0; i < $scope.v.length; i++) {
                for (var j = 0; j < group.length; j++) {
                  if ($scope.v[i].tipologiaRifiuto == group[j].name) {
                    $scope.v[i].icon = group[j].icons[i];
                  }
                }
              }
            });
          });
          break;
        }
      }
    });
  };

  $scope.containsIndirizzo = function (array, item) {
    for (var k = 0; k < array.length; k++) {
      if (array[k].indirizzo == item.indirizzo) {
        return false;
      }
    }
    return true;
  }
  $scope.readJson();
})

.controller('PuntoDiRaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $http) {

  $scope.id = $stateParams.id;

  $scope.isCRM = false;

  $scope.rifiuti = [];

  $scope.orari = [];
  //[{giorno:"lunedì",orari:["12.00-14.00","15.30-17.30"...]}...]

  $scope.back = function () {
    $ionicNavBarDelegate.$getByHandle('navBar').back();
  }

  $scope.pdr = {};

  $scope.readJson = function () {
    $http.get('data/db/puntiRaccolta.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].indirizzo == $scope.id || data[i].dettaglioIndirizzo == $scope.id) {
          $scope.pdr = data[i];
          break;
        }
      }
      if ($scope.pdr.tipologiaPuntiRaccolta == 'CRM') {
        $scope.isCRM = true;
      }
      $http.get('data/db/raccolta.json').success(function (raccolta) {
        for (var i = 0; i < raccolta.length; i++) {
          if (raccolta[i].tipologiaPuntoRaccolta == $scope.pdr.tipologiaPuntiRaccolta && $scope.rifiuti.indexOf(raccolta[i].tipologiaRaccolta) == -1) {
            $scope.rifiuti.push(raccolta[i].tipologiaRaccolta);
          }
        }
      });
      if (!!$scope.pdr.dalle) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].indirizzo == $scope.id || data[i].dettaglioIndirizzo == $scope.id) {
            var j = $scope.checkGiorni(data[i].il);
            if (j == -1) {
              $scope.orari.push({
                giorno: data[i].il,
                orari: [data[i].dalle + "-" + data[i].alle]
              });
            } else {
              if ($scope.orari[j].orari.indexOf(data[i].dalle + "-" + data[i].alle) == -1) {
                $scope.orari[j].orari.push(data[i].dalle + "-" + data[i].alle);
              }
            }
          }
        }
      }
    });
  };

  $scope.readJson();

  $scope.checkGiorni = function (item) {
    for (var j = 0; j < $scope.orari.length; j++) {
      if ($scope.orari[j].giorno == item) {
        return j;
      }
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
})