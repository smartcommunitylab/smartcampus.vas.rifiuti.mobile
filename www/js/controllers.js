angular.module('starter.controllers', ['google-maps'])

.controller('AppCtrl', function ($scope) {})

.controller('HomeCtrl', function ($scope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, $http, $location) {

	var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

	$scope.rifiuti = [];
	$scope.f = [];
	$scope.listaRifiuti = [];

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

	$scope.readNotes = function () {
		$http.get('data/saves/notes.json').success(function (notes) {
			$scope.notes = notes;
		});
	};

	$scope.saveNotes = function () {
		//$http.post('data/saves/notes.json', $scope.notes).success(function () { alert('salvataggio riuscito!');});
	};

	$scope.readJson = function () {
		$http.get('data/db/riciclabolario.json').success(function (data) {
			$scope.listaRifiuti = data;
		});
		$http.get('data/db/tipologiaRifiuto.json').success(function (tdr) {
			$scope.rifiuti = tdr;
			$http.get('data/support/tipologiaRifiutoImmagini.json').success(function (tdri) {
				for (var i = 0; i < $scope.rifiuti.length; i++) {
					for (var j = 0; j < tdri.length; j++) {
						if ($scope.rifiuti[i].valore == tdri[j].valore) {
							$scope.rifiuti[i].immagine = tdri[j].immagine;
						}
					}
				}
				$scope.f = $scope.oneInThree($scope.rifiuti);
			});
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
		$scope.saveNotes();
	};

	$scope.removeNote = function (id) {
		for (var i = 0; i < $scope.notes.length; i = i + 1) {
			if ($scope.notes[i].id == id) {
				$scope.notes.splice(i, 1);
			}
		}
		$scope.saveNotes();
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
				$scope.saveNotes();
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
		if (query.length < 3) {
			return function (item) {
				return false;
			}
		} else {
			return function (item) {
				return item.nome.indexOf(query) != -1;
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

.controller('PDRCtrl', function ($scope, $http, $location) {

	$scope.init = function () {
		//var mapHeight = 10; // or any other calculated value
		//mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
		//angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
		$http.get('data/db/puntiRaccolta.json').success(function (loc) {
			var profiloProva = "Comano Terme";
			var points = [];
			for (var i = 0; i < loc.length; i++) {
				if (loc[i].area == profiloProva && loc[i].indirizzo.indexOf(profiloProva) != -1 && $scope.containsIndirizzo(points, loc[i])) {
					points.push({
						id: loc[i].dettaglioIndirizzo != '' ? loc[i].dettaglioIndirizzo : loc[i].indirizzo,
						latitude: loc[i].localizzazione.split(',')[0],
						longitude: loc[i].localizzazione.split(',')[1],
						icon: loc[i].tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_poi_crm.png' : 'img/ic_poi_isolaeco.png'
					});
					//for (var j = 0; j < $scope.locs.length; j++) {
					//	if ($scope.locs[j].tipologiaPuntoRaccolta == loc[i].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.locs[j].locs, loc[i])) {
					//		$scope.locs[j].locs.push(loc[i]);
					//	}
					//}
				}
			}
			$scope.markers.models = points;
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
		var current = $location.absUrl();
		var final = current.split('#')[0] + '#/app/puntoDiRaccolta/' + $markerModel.id;
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
			'mapTypeControl': false
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

	$scope.$on('$viewContentLoaded', function () {
		var mapHeight = 10; // or any other calculated value
		mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
		angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
		//$scope.map.control.refresh();
	});
	/*var pippo = [{
			id: 1,
			latitude: 46.0,
			longitude: 11.0,
			icon: 'img/ic_poi_isolaeco.png'
    	}, {
			id: 2,
			latitude: 47.0,
			longitude: 12.0,
			icon: 'img/ic_poi_isolaeco.png'
    	}
	];*/

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

.controller('RaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $http) {
	$scope.id = $stateParams.id;
	$scope.back = function () {
		$ionicNavBarDelegate.$getByHandle('navBar').back();
	}
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
				var profiloProva = "Comano Terme";
				for (var i = 0; i < loc.length; i++) {
					if (loc[i].area == profiloProva && loc[i].indirizzo.indexOf(profiloProva) != -1) {
						for (var j = 0; j < $scope.locs.length; j++) {
							if ($scope.locs[j].tipologiaPuntoRaccolta == loc[i].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.locs[j].locs, loc[i])) {
								$scope.locs[j].locs.push(loc[i]);
								//console.log('area: ' + loc[i].area + '\n tipologiaPuntiRaccolta: ' + loc[i].tipologiaPuntiRaccolta + '\n tipologiaUtenza: ' + loc[i].tipologiaUtenza + '\n localizzazione: ' + loc[i].localizzazione + '\n indirizzo: ' + loc[i].indirizzo + '\n dettaglioIndirizzo: ' + loc[i].dettaglioIndirizzo + '\n dataDa: ' + loc[i].dataDa + '\n dataA: ' + loc[i].dataA + '\n il: ' + loc[i].il + '\n dalle: ' + loc[i].dalle + '\n alle: ' + loc[i].alle + '\n' + '\n');
							}
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

	//		{
	//			"area": "Zuclo",
	//			"tipologiaPuntiRaccolta": "CRM",
	//			"tipologiaUtenza": "utenza domestica",
	//			"localizzazione": "46.036666762973304,10.73291132695351",
	//			"indirizzo": "Tione di Trento",
	//			"dettaglioIndirizzo": "Tione di Trento, Loc. Vat",
	//			"dataDa": "2014-01-01",
	//			"dataA": "2014-12-31",
	//			"il": "sabato",
	//			"dalle": "13:30",
	//			"alle": "17:00"
	//		}, {
	//			"area": "Bersone",
	//			"tipologiaPuntiRaccolta": "Isola Ecologica",
	//			"tipologiaUtenza": "utenza domestica",
	//			"localizzazione": "45.94645210967276,10.632630507236849",
	//			"indirizzo": "Bersone Fraz Formino",
	//			"dettaglioIndirizzo": "",
	//			"dataDa": "",
	//			"dataA": "",
	//			"il": "",
	//			"dalle": "",
	//			"alle": ""
	//		}

	$scope.readJson();
})

.controller('RifiutoCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $http) {
	$scope.id = $stateParams.id;
	$scope.back = function () {
		$ionicNavBarDelegate.$getByHandle('navBar').back();
	}
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
							var profiloProva = "Comano Terme";
							for (var k = 0; k < loc.length; k++) {
								if (loc[k].area == profiloProva && loc[k].indirizzo.indexOf(profiloProva) != -1) {
									for (var j = 0; j < $scope.v.length; j++) {
										if ($scope.v[j].tipologiaPuntoRaccolta == loc[k].tipologiaPuntiRaccolta && $scope.containsIndirizzo($scope.v[j].locs, loc[k])) {
											$scope.v[j].locs.push(loc[k]);
										}
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

	//{"area":"Dorsino","tipologiaPuntiRaccolta":"CRM","tipologiaUtenza":"utenza domestica","localizzazione":"46.034259734401125,10.858212180193288","indirizzo":"Comano Terme","dettaglioIndirizzo":"Comano Terme, Loc. Dos dei Larici","dataDa":"2014-01-01","dataA":"2014-01-31","il":"lunedì","dalle":"13:00","alle":"17:00"}

	//{"area":"Comano Terme","tipologiaPuntiRaccolta":"CRM","tipologiaUtenza":"utenza domestica","localizzazione":"46.034259734401125,10.858212180193288","indirizzo":"Comano Terme","dettaglioIndirizzo":"Comano Terme, Loc. Dos dei Larici","dataDa":"2014-01-01","dataA":"2014-01-31","il":"lunedì","dalle":"13:00","alle":"17:00"}

	$scope.indirizzoIfIsCRM = function () {
		if ($scope.isCRM) {
			return $scope.pdr.indirizzo;
		} else {
			return 'Area Giudicarie';
		}
	};
})

.controller('ProfiliCtrl', function ($scope) {
	$scope.p = [{
		name: "Casa",
		type: "Utenza domestica",
		loc: "fiavè"
		}, {
		name: "Ufficio",
		type: "Utenza non domestica",
		loc: "fiavè"
		}, {
		name: "Random",
		type: "Utenza occasionale",
		loc: "fiavè"
		}];
})

.controller('AggiungiProfiloCtrl', function ($scope) {})

.controller('ModificaProfiloCtrl', function ($scope) {})

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
