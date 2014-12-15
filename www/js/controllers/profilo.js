angular.module('starter.controllers.profilo', [])

.controller('ProfiliCtrl', function ($scope, $rootScope) {})

.controller('AggiungiProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $http, $ionicPopup) {

  $scope.saveProfiles = function () {
    if (!$rootScope.supports_html5_storage()) {
      return;
    }
    var stringP = "";
    for (var i = 0; i < $rootScope.p.length; i++) {
      if (stringP != "") {
        stringP = stringP + "[[;" + $rootScope.p[i].name + "([;" + $rootScope.p[i].type + "([;" + $rootScope.p[i].loc;
      } else {
        stringP = $rootScope.p[i].name + "([;" + $rootScope.p[i].type + "([;" + $rootScope.p[i].loc;
      }
      // [[; : separatore tra i profili
      // ([; : separatore tra il nome, la tipologia di utenza e il comune
    }
    if (stringP != "") {
      localStorage.setItem("profiles", stringP);
    } else {
      localStorage.setItem("profiles", "!!-null");
    }
    $rootScope.menuProfilesUpdate();
  };

  $scope.back = function () {
    $ionicNavBarDelegate.$getByHandle('navBar').back();
  };

  $scope.locs = [];

  $scope.tipologiaUtenza = [
  "Residente",
  "Azienda standard",
  "Turista occasionale",
        "Turista stagionale",
        "Azienda con porta a porta"

 ];

  $scope.profilo = {
    name: "",
    utenza: $scope.tipologiaUtenza[0],
    comune: "Selezionare"
  };

  $scope.save = function () {
    if ($scope.profilo.name != "" && $scope.profilo.comune != "Selezionare") {
      $rootScope.readProfiles();
      if (!$scope.containsName($rootScope.p, $scope.profilo.name)) {
        var popup = $ionicPopup.show({
          title: '<b class="popup-title">Attenzione !<b/>',
          template: 'Il nome del profilo è già in uso!',
          buttons: [
            {
              text: 'OK'
                    }
    ]
        });
        return;
      }
      $rootScope.p.push({
        name: $scope.profilo.name,
        type: $scope.profilo.utenza,
        loc: $scope.profilo.comune
      });
      $scope.saveProfiles();
      $scope.back();
    } else {
      var popup = $ionicPopup.show({
        title: '<b class="popup-title">Attenzione !<b/>',
        template: 'Per completare il tuo profilo devi scegliere un nome e un comune!',
        scope: $scope,
        buttons: [
          {
            text: 'OK'
                    }
    ]
      });
    }
  };

  $scope.containsName = function (array, item) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].name == item) {
        return false;
      }
    }
    return true;
  };

  $scope.init = function () {
    $http.get('data/db/aree.json').success(function (data) {
      for (var i = 0; i < data.length; i++) {
        if (!!data[i].comune) {
          $scope.locs.push(data[i].comune);
        }
      }
    });
  };

  $scope.init();
})

.controller('ModificaProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $http, $stateParams, $ionicPopup) {

  $scope.id = $stateParams.id;

  $scope.back = function () {
    $ionicNavBarDelegate.$getByHandle('navBar').back();
  };

  $scope.locs = [];

  $scope.tipologiaUtenza = [
  "Residente",
  "Azienda standard",
  "Turista occasionale",
        "Turista stagionale",
        "Azienda con porta a porta"
 ];

  $scope.profilo = {
    name: "",
    utenza: $scope.tipologiaUtenza[0],
    comune: "Selezionare"
  };

  $scope.isCurrentProfile = true;

  $scope.editMode = false;

  $scope.editIMG = "img/ic_edit.png";

  $scope.saveProfiles = function () {
    if (!$rootScope.supports_html5_storage()) {
      return;
    }
    var stringP = "";
    for (var i = 0; i < $rootScope.p.length; i++) {
      if (stringP != "") {
        stringP = stringP + "[[;" + $rootScope.p[i].name + "([;" + $rootScope.p[i].type + "([;" + $rootScope.p[i].loc;
      } else {
        stringP = $rootScope.p[i].name + "([;" + $rootScope.p[i].type + "([;" + $rootScope.p[i].loc;
      }
      // [[; : separatore tra i profili
      // ([; : separatore tra il nome, la tipologia di utenza e il comune
    }
    if (stringP != "") {
      localStorage.setItem("profiles", stringP);
    } else {
      localStorage.setItem("profiles", "!!-null");
    }
    $rootScope.menuProfilesUpdate();
  };

  $scope.edit = function () {
    if (!$scope.editMode) {
      $scope.editMode = true;
      $scope.editIMG = "img/ic_save.png";
    } else {
      var p = $rootScope.findProfileById($scope.id);
      if ($scope.profilo.name != p.name || $scope.profilo.utenza != p.type || $scope.profilo.comune != p.loc) {
        if ($scope.profilo.name != "" && $scope.profilo.comune != "Selezionare") {
          var index = $rootScope.findIndexById(p.name);
          if ($scope.profilo.name != p.name && $scope.findProfileById($scope.profilo.name) != null) {
            var popup = $ionicPopup.show({
              title: '<b class="popup-title">Attenzione !<b/>',
              template: 'Il nome del profilo è già in uso!',
              buttons: [
                {
                  text: 'OK'
                       }
       ]
            });
            return;
          }
          $rootScope.p[index].name = $scope.profilo.name;
          $rootScope.p[index].type = $scope.profilo.utenza;
          $rootScope.p[index].loc = $scope.profilo.comune;
          $scope.saveProfiles();
          $scope.editMode = false;
          $scope.editIMG = "img/ic_edit.png";
        } else {
          var popup = $ionicPopup.show({
            title: '<b class="popup-title">Attenzione !<b/>',
            template: 'Per completare il tuo prifilo devi scegliere un nome e un comune!',
            scope: $scope,
            buttons: [
              {
                text: 'OK'
                      }
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
      template: 'Premendo OK cancellerai definitivamente questo profilo, incluse le eventuali note personali. Confermi?',
      scope: $scope,
      buttons: [
        {
          text: 'Annulla'
                    },
        {
          text: 'OK',
          onTap: function (e) {
            return true;
          }
    }
   ]
    });
    popup.then(function (res) {
      if (!!res) {
        var v = $rootScope.p;
        v.splice($rootScope.findIndexById($scope.id), 1);
        $rootScope.p = v;
        $scope.saveProfiles();
        $scope.back();
      }
    });
  };

  $http.get('data/db/aree.json').success(function (data) {
    for (var i = 0; i < data.length; i++) {
      if (!!data[i].comune) {
        $scope.locs.push(data[i].comune);
      }
    }
  });
  var p = $rootScope.findProfileById($scope.id);
  if (!!p) {
    $scope.profilo.name = p.name;
    $scope.profilo.utenza = p.type;
    $scope.profilo.comune = p.loc;
  }
  if ($rootScope.selectedProfile.name == $scope.profilo.name) {
    $scope.isCurrentProfile = true;
  } else {
    $scope.isCurrentProfile = false;
  }
})