angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope) {})

.controller('HomeCtrl', function ($scope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, $http) {

	var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

	$scope.rifiuti = [];
	$scope.f = [];

	$scope.notes = [{
		id: 0,
		note: 'uno'
    }, {
		id: 1,
		note: 'due'
    }, {
		id: 2,
		note: 'tre'
    }];
	$scope.selectedNotes = [];

	$scope.noteSelected = false;
	$scope.multipleNoteSelected = false;

	$scope.readJson = function () {
		$http.get('data/dati.json').success(function (data) {
			$scope.rifiuti = data.trash;
			$scope.f = $scope.oneInThree($scope.rifiuti);
		});
	};

	$scope.readJson();

	$timeout(function () {
		delegate.select(1);
	}, 50);

	$scope.addNote = function (nota) {
		$scope.notes.push({
			id: function () {
				for (var i = 0; i <= $scope.notes.length; i = i + 1) {
					if (function (i) {
						for (var j = 0; j < $scope.notes.length; j = j + 1) {
							if ($scope.notes[j].id == i) {
								return false;
							}
						}
						return true;
					}) {
						return i;
					}
				}
			},
			note: nota
		});
	};

	$scope.removeNote = function (id) {
		for (var i = 0; i < $scope.notes.length; i = i + 1) {
			if ($scope.notes[i].id == id) {
				$scope.notes.splice(i, 1);
			}
		}
	};

	$scope.noteSelect = function (nota) {
		var p = $scope.selectedNotes.indexOf(nota);
		if (p == -1) {
			$scope.selectedNotes.push(nota);
			$scope.noteSelected = true;
			if ($scope.selectedNotes.length > 1) {
				$scope.multipleNoteSelected = true;
			}
		} else {
			$scope.selectedNotes.splice(p, 1);
			if ($scope.selectedNotes.length <= 1) {
				$scope.multipleNoteSelected = false;
			}
			if ($scope.selectedNotes.length < 1) {
				$scope.noteSelected = false;
			}
		}
	};

	$scope.click = function () {
		if ($scope.noteSelected) {
			while ($scope.selectedNotes.length > 0) {
				$scope.removeNote($scope.selectedNotes[0].id);
				$scope.noteSelect($scope.selectedNotes[0]);
			}
		} else {
			$scope.data = {};

			var popup = $ionicPopup.show({
				template: '<input type="text" ng-model="data.nota">',
				title: 'Cosa vuoi ricordare?',
				scope: $scope,
				buttons: [
					{
						text: 'Cancel'
                    },
					{
						text: '<b>Save</b>',
						type: 'button-positive',
						onTap: function (e) {
							if (!$scope.data.nota) {
								e.preventDefault();
							} else {
								return $scope.data.nota;
							}
						}
                }
            ]
			});
			popup.then(function (res) {
				if (res != null && res != undefined) {
					$scope.addNote(res);
				}
			});
		}
	};

	$scope.edit = function () {
		$scope.data = {};

		var popup = $ionicPopup.show({
			template: '<input type="text" ng-model="data.nota">',
			title: 'Cosa vuoi ricordare?',
			scope: $scope,
			buttons: [
				{
					text: 'Cancel'
                    },
				{
					text: '<b>Save</b>',
					type: 'button-positive',
					onTap: function (e) {
						if (!$scope.data.nota) {
							e.preventDefault();
						} else {
							return $scope.data.nota;
						}
					}
                }
            ]
		});
		popup.then(function (res) {
			if (res != null && res != undefined) {
				$scope.notes[$scope.notes.indexOf($scope.selectedNotes[0])].note = res;
				$scope.noteSelect($scope.selectedNotes[0]);
			}
		});
	};

	$scope.noteReset = function () {
		$scope.selectedNotes = [];
		$scope.noteSelected = false;
		$scope.multipleNoteSelected = false;
	};

	$scope.titleText = function () {
		if (!$scope.noteSelected) {
			return '100% Riciclo';
		} else {
			return '';
		}
	};

	$scope.leftClick = function () {
		if (!$scope.noteSelected) {
			$ionicSideMenuDelegate.toggleLeft();
		} else {
			$scope.noteReset();
		}
	};

	$scope.match = function (query) {
		if (query == '') {
			return function (item) {
				return false;
			}
		} else {
			return function (item) {
				return item.indexOf(query) != -1;
			}
		}
	};

	$scope.oneInThree = function (v) {
		var f = [];
		for (var i = 0; i < v.length; i = i + 3) {
			f[i / 3] = v[i];
		}
		return f;
	};
})
	.controller('InfoCtrl', function ($scope) {})
	.controller('PDRCtrl', function ($scope) {})
	.controller('TDRCtrl', function ($scope) {
		$scope.v = [{
			name: "Residuo",
			icons: ["img/ic_isola_eco_olivegreen.png"]
		}, {
			name: "Imballaggi di verto",
			icons: [
				"img/ic_isola_eco_green.png",
				"img/ic_crm_grey.png"
			]
		}, {
			name: "Medicinali scaduti",
			icons: [
				"img/ic_farmacia_red.png",
				"img/ic_crm_grey.png"
			]
		}, {
			name: "Pile",
			icons: [
				"img/ic_isola_eco_green.png",
				"img/ic_rivenditore_red.png"
			]
		}];
	})
	.controller('RaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate) {
		$scope.id = $stateParams.id;
		$scope.back = function () {
			$ionicNavBarDelegate.$getByHandle('navBar').back();
		}
		$scope.v = {
			rifiuti: ["Accendini", "Radiografie", "Feltrini"],
			pdr: [{
				title: "Isola Ecologica",
				rifiuto: "Residuo",
				desc: "Nel contenitore del RESIDUO, utilizzando l'apposita chiave eletronica",
				icon: "img/ic_isola_eco_green.png",
				locs: ["Fiavè Scuola", "Fiavè Stumiaga"],
				aperto: false // per grafica (lo dovrò aggiungere io ?)
			}, {
				title: "Isola",
				rifiuto: "Residuo",
				desc: "",
				icon: "img/ic_isola_eco_blue.png",
				locs: ["Fiavè Cimitero", "Fiavè Doss"],
				aperto: false
			}]
		};
	})
	.controller('RifiutoCtrl', function ($scope, $stateParams, $ionicNavBarDelegate) {
		$scope.id = $stateParams.id;
		$scope.back = function () {
			$ionicNavBarDelegate.$getByHandle('navBar').back();
		}
		$scope.pdr = [{
			title: "Isola Ecologica",
			rifiuto: "Residuo",
			desc: "Nel contenitore del RESIDUO, utilizzando l'apposita chiave eletronica",
			icon: "img/ic_isola_eco_green.png",
			locs: ["Fiavè Scuola", "Fiavè Stumiaga"],
			aperto: false
		}, {
			title: "Isola",
			rifiuto: "Residuo",
			desc: "",
			icon: "img/ic_isola_eco_blue.png",
			locs: ["Fiavè Cimitero", "Fiavè Doss"],
			aperto: false
		}];
	})
	.controller('ProfiliCtrl', function ($scope) {})
	.controller('SegnalaCtrl', function ($scope) {})
	.controller('ContattiCtrl', function ($scope, $ionicScrollDelegate) {
		$scope.v = [
			{
				title: "Servizio TIA e informatica",
				t1: "Per informazioni in merito alla Tariffa di Igene Urbana",
				t2: "Via Padre Gnesotti, 2 38079 Tione di Trento TN",
				t3: "lunedì - giovedì 8.30-12.30 14.00-17.00 venerdì 8.30-12.30",
				web: "www.comunitadellegiudicarie.it",
				tel: "0465/339532",
				email: "serviziotiaeinformatica@comunedellegiudicarie.it",
				pec: "c.giudicarie.legamail.it",
				fax: "0465/339548",
				aperto: false
			},
			{
				title: "Ufficio Igene Ambientale",
				t1: "Per informazioni in merito alla raccolta differenziata",
				t2: "Centro Integrato, Loc. Zuclo 38079 Zuclo TN",
				t3: "lunedì - giovedì 8.30-12.30 14.00-17.00 venerdì 8.30-12.30",
				web: "www.comunitadellegiudicarie.it",
				tel: "0465/325038",
				email: "rifiuti@comunitadellegiudicarie.it",
				pec: "c.giudicarie.legamail.it",
				fax: "0465/329043",
				aperto: false
			},
		];
		$scope.mainScrollResize = function () {
			$ionicScrollDelegate.$getByHandle('mainScroll').resize();
		}
	})
