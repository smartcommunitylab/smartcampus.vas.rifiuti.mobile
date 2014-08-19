angular.module('starter.controllers', ['google-maps'])

.controller('AppCtrl', function ($scope, $rootScope) {
	$scope.profili = [{
		name: "casa",
		type: "utenza domestica",
		place: "Fiavè",
		image: "img/rifiuti_btn_radio_off_holo_light.png"
	}, {
		name: "ufficio",
		type: "utenza non domestica",
		place: "Fiavè",
		image: "img/rifiuti_btn_radio_off_holo_light.png"
	}, {
		name: "random",
		type: "utenza domestica",
		place: "Montagne",
		image: "img/rifiuti_btn_radio_off_holo_light.png"
	}, {
		name: "pippo",
		type: "utenza domestica",
		place: "Comano terme",
		image: "img/rifiuti_btn_radio_off_holo_light.png"
	}];

	$rootScope.selectedProfile = null;

	$scope.selectProfile = function (index) {
		if (!!$rootScope.selectedProfile) {
			$scope.profili[$scope.profili.indexOf($rootScope.selectedProfile)].image = "img/rifiuti_btn_radio_off_holo_light.png";
		}
		$scope.profili[index].image = "img/rifiuti_btn_radio_on_holo_light.png";
		$rootScope.selectedProfile = $scope.profili[index];
	};

	$scope.selectProfile(0);
})

.controller('HomeCtrl', function ($scope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, $http, $location) {

	var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

	$scope.variableIMG = "img/ic_add.png";

	$scope.updateIMG = function () {
		$scope.variableIMG = !$scope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
	};

	$scope.rifiuti = [];
	$scope.f = [];
	$scope.listaRifiuti = [];

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.notes = [];

	/*$scope.notes = [{
		id: 0,
		note: 'uno'
    }, {
		id: 1,
		note: 'due'
    }, {
		id: 2,
		note: 'tre'
    }];*/

	$scope.selectedNotes = [];

	$scope.noteSelected = false;
	$scope.multipleNoteSelected = false;

	$scope.readNotes = function () {
		//		$http.get('data/saves/notes.json').success(function (notes) {
		//			$scope.notes = notes;
		//		});
		if (!$scope.supports_html5_storage) {
			return;
		}
		$scope.notes = [];
		var stringNote = localStorage.getItem("notes");
		if (!!stringNote && stringNote != "!!-null") {
			var rawNotes = [];
			rawNotes = stringNote.split("[[;");
			for (var i = 0; i < rawNotes.length; i++) {
				$scope.notes.push({
					id: parseInt(rawNotes[i].split("([;")[0], 10),
					note: rawNotes[i].split("([;")[1]
				});
			}
		}
	};

	$scope.saveNotes = function () {
		//localStorage.setItem("notes", $scope.notes);
		if (!$scope.supports_html5_storage) {
			return;
		}
		var stringNote = "";
		for (var i = 0; i < $scope.notes.length; i++) {
			if (stringNote != "") {
				stringNote = stringNote + "[[;" + $scope.notes[i].id + "([;" + $scope.notes[i].note;
			} else {
				stringNote = $scope.notes[i].id + "([;" + $scope.notes[i].note;
			}
			// [[; : separatore tra le note
			// ([; : separatore tra l' id e la nota
		}
		if (stringNote != "") {
			localStorage.setItem("notes", stringNote);
		} else {
			localStorage.setItem("notes", "!!-null")
		}
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
		var idAvailable = $scope.findNextId();
		$scope.notes.push({
			id: idAvailable,
			note: nota
		});
		$scope.saveNotes();
	};

	$scope.findNextId = function () {
		for (var i = 0; i <= $scope.notes.length; i++) {
			if ($scope.idExists(i)) {
				return i;
			}
		}
	};

	$scope.idExists = function (i) {
		for (var j = 0; j < $scope.notes.length; j++) {
			if ($scope.notes[j].id == i) {
				return false;
			}
		}
		return true;
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
		$scope.updateIMG();
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

.controller('PDRCtrl', function ($scope, $timeout, $http, $location, $stateParams) {

	$scope.mapView = true;

	$scope.id = $stateParams.id != '!' ? $stateParams.id : null;

	$scope.list = [];

	$scope.variableIMG = "img/ic_list.png";

	$scope.updateIMG = function () {
		$scope.variableIMG = $scope.mapView ? "img/ic_list.png" : "img/ic_map.png";
	};

	$scope.init = function () {
		$http.get('data/db/puntiRaccolta.json').success(function (loc) {
			var profiloProva = "Comano Terme";
			var points = [];
			for (var i = 0; i < loc.length; i++) {
				var indirizzo = loc[i].dettaglioIndirizzo != "" ? loc[i].dettaglioIndirizzo : loc[i].indirizzo;
				if (loc[i].area == profiloProva && loc[i].indirizzo.indexOf(profiloProva) != -1 && $scope.containsIndirizzo(points, loc[i]) && ($scope.id == null || indirizzo == $scope.id)) {
					points.push({
						id: loc[i].dettaglioIndirizzo != '' ? loc[i].dettaglioIndirizzo : loc[i].indirizzo,
						latitude: loc[i].localizzazione.split(',')[0],
						longitude: loc[i].localizzazione.split(',')[1],
						icon: loc[i].tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_poi_crm.png' : 'img/ic_poi_isolaeco.png'
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
			var mapHeight = 10; // or any other calculated value
			mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
			angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
		}, 50);
	};

	$scope.$on('$viewContentLoaded', function () {
		$timeout(function () {
			var mapHeight = 10; // or any other calculated value
			mapHeight = angular.element(document.querySelector('#map-container'))[0].offsetHeight;
			angular.element(document.querySelector('.angular-google-map-container'))[0].style.height = mapHeight + 'px';
		}, 50);
		//$scope.map.control.refresh();
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

.controller('RaccoltaCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $http) {

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
				var profiloProva = "Comano Terme";
				for (var i = 0; i < loc.length; i++) {
					if (loc[i].area == profiloProva && loc[i].indirizzo.indexOf(profiloProva) != -1) {
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

.controller('RifiutoCtrl', function ($scope, $stateParams, $ionicNavBarDelegate, $http) {

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

.controller('AggiungiProfiloCtrl', function ($scope, $ionicNavBarDelegate) {
	$scope.back = function () {
		$ionicNavBarDelegate.$getByHandle('navBar').back();
	};
})

.controller('ModificaProfiloCtrl', function ($scope, $ionicNavBarDelegate) {
	$scope.back = function () {
		$ionicNavBarDelegate.$getByHandle('navBar').back();
	};
})

.controller('SegnalaCtrl', function ($scope) {
	$scope.checked = true;
	$scope.checkboxImage = "img/rifiuti_btn_check_on_holo_light.png";

	$scope.toggleCheck = function () {
		$scope.checked = !$scope.checked;
		$scope.checkboxImage = $scope.checked ? "img/rifiuti_btn_check_on_holo_light.png" : "img/rifiuti_btn_check_off_holo_light.png";
	};
})

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
