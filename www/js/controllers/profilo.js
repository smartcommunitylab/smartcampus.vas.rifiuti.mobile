angular.module('rifiuti.controllers.profilo', [])

.controller('ProfiliCtrl', function ($scope, $rootScope) {})

.controller('ModificaProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $filter, DataManager, $stateParams, $ionicPopup, Profili, Raccolta) {
    $scope.aree = [];

    $scope.profilo = {
        name: "",
        localita: ""
    };

    Profili.tipidiutenza().then(function (tipi) {
        $scope.tipologiaUtenza = tipi;
        if (!$scope.id) {
            $scope.profilo.utenza = tipi[0];
            $scope.updateLocations();
        }
    });

    $scope.id = $stateParams.id;

    var getEditImage = function () {
        return $scope.editMode ? "img/ic_save.png" : "img/ic_edit.png";
    };

    $scope.isCurrentProfile = true;
    $scope.editMode = !$scope.id;
    $scope.editIMG = getEditImage();

    $scope.edit = function () {
        if (!$scope.editMode) {
            $scope.editMode = true;
            $scope.editIMG = getEditImage();
            for (var i = 0; i < $scope.tipologiaUtenza.length; i++) {
                if ($scope.tipologiaUtenza[i].profilo === $scope.profilo.utenza.profilo) {
                    $scope.profilo.utenza = $scope.tipologiaUtenza[i];
                }
            }
        } else {
            if (!!$scope.profilo.name && !!$scope.profilo.area) {
                var newProfile = null;
                if (!!$scope.id) {
                    newProfile = Profili.update($scope.id, $scope.profilo.name, $scope.profilo.utenza, $scope.profilo.area);
                } else {
                    newProfile = Profili.add($scope.profilo.name, $scope.profilo.utenza, $scope.profilo.area);
                    $scope.back();
                    return;
                }
                if (newProfile == null) {
                    var popup = $ionicPopup.show({
                        title: '<b class="popup-title">Attenzione !<b/>',
                        template: 'Il nome del profilo è già in uso!',
                        buttons: [
                            {
                                text: 'OK'
                            }
              ]
                    });
                } else {
                    $scope.editMode = false;
                    $scope.editIMG = getEditImage();
                }
            } else {
                $ionicPopup.show({
                    title: '<b class="popup-title">Attenzione !<b/>',
                    template: 'Per completare il tuo prifilo devi scegliere un nome e una località!',
                    scope: $scope,
                    buttons: [
                        {
                            text: 'OK'
                        }
            ]
                });
            }
        }
    };

    $scope.help = function () {
        var popup = $ionicPopup.show({
            title: '<b class="popup-title">Tipo di utenza<b/>',
            templateUrl: 'templates/profiloHelp.html',
            scope: $scope,
            buttons: [
                {
                    text: 'Chiudi'
                }
      ]
        });
        return;
    };

    $scope.click = function () {
        if ($scope.isCurrentProfile) {
            var popup = $ionicPopup.show({
                title: '<b class="popup-title">Avviso<b/>',
                template: "Non è possibile cancellare il profilo in uso.",
                scope: $scope,
                buttons: [
                    {
                        text: 'OK'
                    }
                ]
            });
            return;
        }

        var popup = $ionicPopup.show({
            title: '<b class="popup-title">Avviso<b/>',
            template: 'Premendo OK cancellerai definitivamente questo profilo. Confermi?',
            //TODO: le note dovrebbero essere legate al profilo??? ora non lo sono!
            //      template: 'Premendo OK cancellerai definitivamente questo profilo, incluse tutte le eventuali note personali. Confermi?',
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')('cancel')
                },
                {
                    text: 'OK',
                    onTap: function (e) {
                        return true;
                    }
                }
            ]
        }).then(function (res) {
            if (!!res) {
                Profili.remove($scope.id);
                $scope.back();
            }
        });
    };

    $scope.updateLocations = function () {
        Raccolta.areeForTipoUtenza($scope.profilo.utenza.tipologiaUtenza).then(function (data) {
            $scope.aree = [];
            for (var i = 0; i < data.length; i++) {
                $scope.aree.push(data[i]);
                if ($scope.profilo.area && data[i].nome == $scope.profilo.area.nome) {
                    $scope.profilo.area = data[i];
                }
            }
        });
    };

    var p = Profili.byId($scope.id);
    if (!!p) {
        $scope.profilo = angular.copy(p);
        $scope.updateLocations();
    }

    if (!!$rootScope.selectedProfile && $rootScope.selectedProfile.name == $scope.profilo.name) {
        $scope.isCurrentProfile = true;
    } else {
        $scope.isCurrentProfile = false;
    }

    var localitaPopup = null;

    $scope.localitaPopup = function () {
        localitaPopup = $ionicPopup.show({
            title: $filter('translate')('Selezionare'),
            templateUrl: 'templates/localita.html',
            scope: $scope,
            buttons: [
                {
                    text: $filter('translate')('cancel')
                }
            ]
        });
    };

    $scope.localitaSelected = function (item) {
        $scope.profilo.area = item;
        localitaPopup.close();
    };
})
