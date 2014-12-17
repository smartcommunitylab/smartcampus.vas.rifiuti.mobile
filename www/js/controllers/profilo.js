angular.module('starter.controllers.profilo', [])

.controller('ProfiliCtrl', function ($scope, $rootScope) {})

.controller('AggiungiProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $http, $ionicPopup, Profili) {
  $scope.locs = [];
  $scope.profilo = {
    name: "",
    localita: "Selezionare"
  };

  Profili.tipidiutenza().then(function(tipi){
    $scope.tipologiaUtenza=tipi;
    $scope.profilo.utenza=tipi[0];
  });
/*
  $scope.tipologiaUtenza = [
  "Residente",
  "Azienda standard",
  "Turista occasionale",
        "Turista stagionale",
        "Azienda con porta a porta"

 ];
*/

  $scope.save = function () {
    if ($scope.profilo.name != "" && $scope.profilo.localita != "Selezionare") {
      Profili.read();
      if (!$scope.containsName($rootScope.p, $scope.profilo.name)) {
        var popup = $ionicPopup.show({
          title: '<b class="popup-title">Attenzione !<b/>',
          template: 'Il nome del profilo è già in uso!',
          buttons: [
            { text: 'OK' }
          ]
        });
        return;
      }
      $rootScope.p.push({
        name: $scope.profilo.name,
        utenza: $scope.profilo.utenza,
        loc: $scope.profilo.localita
      });
      Profili.save();
      $scope.back();
    } else {
      var popup = $ionicPopup.show({
        title: '<b class="popup-title">Attenzione !<b/>',
        template: 'Per completare il tuo profilo devi scegliere un nome e una località!',
        scope: $scope,
        buttons: [
          { text: 'OK' }
        ]
      });
    }
  };

  $scope.init = function () {
    $http.get('data/db/aree.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (!!data[i].localita) {
          $scope.locs.push(data[i].localita);
        }
      }
    });
  };

  $scope.init();
})

.controller('ModificaProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $http, $stateParams, $ionicPopup, Profili) {
  $scope.locs = [];
  $scope.profilo = {
    name: "",
    localita: "Selezionare"
  };

  Profili.tipidiutenza().then(function(tipi){
    $scope.tipologiaUtenza=tipi;
    $scope.profilo.utenza=tipi[0];
  });

  $scope.id = $stateParams.id;

  $scope.isCurrentProfile = true;
  $scope.editMode = false;
  $scope.editIMG = "img/ic_edit.png";

  $scope.edit = function () {
    if (!$scope.editMode) {
      $scope.editMode = true;
      $scope.editIMG = "img/ic_save.png";
    } else {
      var p = Profili.byname($scope.id);
      if ($scope.profilo.name != p.name || $scope.profilo.utenza != p.type || $scope.profilo.localita != p.loc) {
        if ($scope.profilo.name != "" && $scope.profilo.localita != "Selezionare") {
          var editedprofile = Profili.byname($scope.id);
          //TODO: gestire nome profilo già presente
          /*if ($scope.profilo.name != p.name && selectedprofile != null) {
            $ionicPopup.show({
              title: '<b class="popup-title">Attenzione !<b/>',
              template: 'Il nome del profilo è già in uso!',
              buttons: [
                { text: 'OK' }
              ]
            });
          } else {*/
            editedprofile.name = $scope.profilo.name;
            editedprofile.utenza = $scope.profilo.utenza;
            editedprofile.loc = $scope.profilo.localita;
            Profili.save();
          //}
          $scope.editMode = false;
          $scope.editIMG = "img/ic_edit.png";
        } else {
          $ionicPopup.show({
            title: '<b class="popup-title">Attenzione !<b/>',
            template: 'Per completare il tuo prifilo devi scegliere un nome e una località!',
            scope: $scope,
            buttons: [
              { text: 'OK' }
            ]
          });
        }
      } else {
        $scope.editMode = false;
        $scope.editIMG = "img/ic_edit.png";
      }
    }
  };

  $scope.click = function () {
    var popup = $ionicPopup.show({
      title: '<b class="popup-title">Avviso<b/>',
      template: 'Premendo OK cancellerai definitivamente questo profilo. Confermi?',
//TODO: le note dovrebbero essere legate al profilo??? ora non lo sono!
//      template: 'Premendo OK cancellerai definitivamente questo profilo, incluse tutte le eventuali note personali. Confermi?',
      scope: $scope,
      buttons: [
        { text: 'Annulla' },
        {
          text: 'OK',
          onTap: function (e) {
            return true;
          }
        }
      ]
    }).then(function (res) {
      if (!!res) {
        var v = $rootScope.p;
        v.splice(Profili.indexof($scope.id), 1);
        $rootScope.p = v;
        Profili.save();
        $scope.back();
      }
    });
  };

  $http.get('data/db/aree.json').success(function (data) {
    for (var i = 0; i < data.length; i++) {
      if (!!data[i].localita) {
        $scope.locs.push(data[i].localita);
      }
    }
  });
  var p = Profili.byname($scope.id);
  if (!!p) {
    $scope.profilo.name = p.name;
    $scope.profilo.utenza = p.utenza;
    $scope.profilo.localita = p.loc;
  }
  if ($rootScope.selectedProfile.name == $scope.profilo.name) {
    $scope.isCurrentProfile = true;
  } else {
    $scope.isCurrentProfile = false;
  }
})