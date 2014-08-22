angular.module('starter.controllers', ['google-maps'])

.controller('AppCtrl', function ($scope, $rootScope) {
	/*$scope.p = [{
		name: "casa",
		type: "utenza domestica",
		loc: "Fiavè",
		image: "img/rifiuti_btn_radio_off_holo_dark.png"
	}, {
		name: "ufficio",
		type: "utenza non domestica",
		loc: "Fiavè",
		image: "img/rifiuti_btn_radio_off_holo_dark.png"
	}, {
		name: "random",
		type: "utenza domestica",
		loc: "Montagne",
		image: "img/rifiuti_btn_radio_off_holo_dark.png"
	}, {
		name: "pippo",
		type: "utenza domestica",
		loc: "Comano terme",
		image: "img/rifiuti_btn_radio_off_holo_dark.png"
	}];*/

	$rootScope.menuProfilesUpdate = false;

	$scope.showTutorial = function () {
		$rootScope.showTutorial = true;
	};

	$scope.p = [];

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.readProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		$scope.p = [];
		var stringP = localStorage.getItem("profiles");
		if (!!stringP && stringP != "!!-null") {
			var rawP = [];
			rawP = stringP.split("[[;");
			//$scope.$apply(function (scope) {
			for (var i = 0; i < rawP.length; i++) {
				$scope.p.push({
					name: rawP[i].split("([;")[0],
					type: rawP[i].split("([;")[1],
					loc: rawP[i].split("([;")[2],
					image: "img/rifiuti_btn_radio_off_holo_dark.png"
				});
			}
			//});
		}
	};

	$scope.readProfiles();

	$rootScope.selectedProfile = null;

	$scope.selectProfile = function (index) {
		if (index >= $scope.p.length) {
			return;
		}
		if (!!$rootScope.selectedProfile) {
			$scope.findProfileById($rootScope.selectedProfile.name).image = "img/rifiuti_btn_radio_off_holo_dark.png";
		}
		$scope.p[index].image = "img/rifiuti_btn_radio_on_holo_dark.png";
		$rootScope.selectedProfile = $scope.p[index];
	};

	$scope.findProfileById = function (id) {
		$scope.readProfiles();
		for (var i = 0; i < $scope.p.length; i++) {
			if ($scope.p[i].name == id) {
				return $scope.p[i];
			}
		}
		return null;
	};

	$scope.selectProfile(0);

	$rootScope.$watch('menuProfilesUpdate', function (newValue, oldValue) {
		if (!!newValue) {
			$scope.readProfiles();
			$scope.findProfileById($rootScope.selectedProfile.name).image = "img/rifiuti_btn_radio_on_holo_dark.png";
			$rootScope.menuProfileUpdate = false;
		}
	});
})

.controller('HomeCtrl', function ($scope, $rootScope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, $http, $location, $ionicLoading) {

	var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

	$scope.variableIMG = "img/ic_add.png";

	$scope.updateIMG = function () {
		$scope.variableIMG = !$scope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
	};

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.rifiuti = [];
	$scope.f = [];
	$scope.listaRifiuti = [];

	$rootScope.showTutorial;

	$scope.doTutorial = function () {
		if (!$scope.supports_html5_storage()) {
			$rootScope.showTutorial = false;
			return;
		}
		var stringTutorial = localStorage.getItem("tutorial");
		if (stringTutorial == "false") {
			$rootScope.showTutorial = false;
		} else {
			$rootScope.showTutorial = true;
		}
	};

	$scope.doTutorial();

	$scope.stopTutorial = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		localStorage.setItem("tutorial", "false");
	};

	$scope.show = function () {
		if (!!!$rootScope.showTutorial) {
			return;
		}
		$ionicLoading.show({
			templateUrl: 'templates/tutorial.html',
		});
		$rootScope.showTutorial = false;
		$scope.stopTutorial();
	};

	$rootScope.$watch('showTutorial', function (newValue, oldValue) {
		if (!!newValue) {
			$scope.show();
		}
	});

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
		if (!$scope.supports_html5_storage()) {
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
		if (!$scope.supports_html5_storage()) {
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
			localStorage.setItem("notes", "!!-null");
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

	$scope.reset = function () {
		alert("Resetting!");
		if (!$scope.supports_html5_storage()) {
			return;
		}
		localStorage.clear();
	};

	$scope.firstDayIndex = function (week) {
		switch (week[0].day) {
		case "LUN":
			return 0;
		case "MAR":
			return 1;
		case "MER":
			return 2;
		case "GIO":
			return 3;
		case "VEN":
			return 4;
		case "SAB":
			return 5;
		case "DOM":
			return 6;
		}
	};

	$scope.lastDayIndex = function (week) {
		switch (week[week.length - 1].day) {
		case "LUN":
			return 0;
		case "MAR":
			return 1;
		case "MER":
			return 2;
		case "GIO":
			return 3;
		case "VEN":
			return 4;
		case "SAB":
			return 5;
		case "DOM":
			return 6;
		}
	};

	$scope.getEmptyArrayByLenght = function (lenght) {
		var array = [];
		for (var i = 0; i < lenght; i++) {
			array.push(i);
		}
		return array;
	};

	$scope.today = 22;

	$scope.month = {
		name: "agosto 2014",
		weeks: [
			[
				{
					date: 1,
					day: "VEN",
					events: []
				},
				{
					date: 2,
					day: "SAB",
					events: [
						{
							color: "blue"
						}
					]
				},
				{
					date: 3,
					day: "DOM",
					events: []
				}
			],
			[
				{
					date: 4,
					day: "LUN",
					events: []
				},
				{
					date: 5,
					day: "MAR",
					events: [
						{
							/*Dati del evento*/
							color: "red"
						}
					]
				},
				{
					date: 6,
					day: "MER",
					events: []
				},
				{
					date: 7,
					day: "GIO",
					events: []
				},
				{
					date: 8,
					day: "VEN",
					events: [
						{
							color: "blue"
						}, {
							color: "blue"
						}
					]
				},
				{
					date: 9,
					day: "SAB",
					events: [{
						color: "green"
						}]
				},
				{
					date: 10,
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					date: 11,
					day: "LUN",
					events: [{
						color: "yellow"
						}]
				},
				{
					date: 12,
					day: "MAR",
					events: []
				},
				{
					date: 13,
					day: "MER",
					events: [
						{
							color: "blue"
						},
						{
							color: "red"
						}, {
							color: "brown"
						}]
				},
				{
					date: 14,
					day: "GIO",
					events: []
				},
				{
					date: 15,
					day: "VEN",
					events: []
				},
				{
					date: 16,
					day: "SAB",
					events: []
				},
				{
					date: 17,
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					date: 18,
					day: "LUN",
					events: []
				},
				{
					date: 19,
					day: "MAR",
					events: []
				},
				{
					date: 20,
					day: "MER",
					events: []
				},
				{
					date: 21,
					day: "GIO",
					events: []
				},
				{
					date: 22,
					day: "VEN",
					events: []
				},
				{
					date: 23,
					day: "SAB",
					events: []
				},
				{
					date: 24,
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					date: 25,
					day: "LUN",
					events: []
				},
				{
					date: 26,
					day: "MAR",
					events: [{
							color: "blue"
						},
						{
							color: "red"
						}]
				},
				{
					date: 27,
					day: "MER",
					events: [{
						color: "blue"
						}]
				},
				{
					date: 28,
					day: "GIO",
					events: [{
						color: "blue"
						}]
				},
				{
					date: 29,
					day: "VEN",
					events: []
				},
				{
					date: 30,
					day: "SAB",
					events: []
				},
				{
					date: 31,
					day: "DOM",
					events: []
				}
			]
		]
	};
})

.controller('InfoCtrl', function ($scope) {})

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
						//icon: loc[i].tipologiaPuntiRaccolta == 'CRM' ? 'img/ic_poi_crm.png' : 'img/ic_poi_isolaeco.png'
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

.controller('ProfiliCtrl', function ($scope, $rootScope) {
	/*$scope.p = [{
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
		}];*/

	$scope.p = [];

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.readProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		$scope.p = [];
		var stringP = localStorage.getItem("profiles");
		if (!!stringP && stringP != "!!-null") {
			var rawP = [];
			rawP = stringP.split("[[;");
			for (var i = 0; i < rawP.length; i++) {
				$scope.p.push({
					name: rawP[i].split("([;")[0],
					type: rawP[i].split("([;")[1],
					loc: rawP[i].split("([;")[2]
				});
			}
		}
	};

	$scope.saveProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		var stringP = "";
		for (var i = 0; i < $scope.p.length; i++) {
			if (stringP != "") {
				stringP = stringP + "[[;" + $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			} else {
				stringP = $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			}
			// [[; : separatore tra i profili
			// ([; : separatore tra il nome, la tipologia di utenza e il comune
		}
		if (stringP != "") {
			localStorage.setItem("profiles", stringP);
		} else {
			localStorage.setItem("profiles", "!!-null");
		}
		$rootScope.menuProfilesUpdate = true;
	};

	$scope.readProfiles();
})

.controller('AggiungiProfiloCtrl', function ($scope, $rootScope, $ionicNavBarDelegate, $http) {

	$scope.p = [];

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.readProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		$scope.p = [];
		var stringP = localStorage.getItem("profiles");
		if (!!stringP && stringP != "!!-null") {
			var rawP = [];
			rawP = stringP.split("[[;");
			for (var i = 0; i < rawP.length; i++) {
				$scope.p.push({
					name: rawP[i].split("([;")[0],
					type: rawP[i].split("([;")[1],
					loc: rawP[i].split("([;")[2]
				});
			}
		}
	};

	$scope.saveProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		var stringP = "";
		for (var i = 0; i < $scope.p.length; i++) {
			if (stringP != "") {
				stringP = stringP + "[[;" + $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			} else {
				stringP = $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			}
			// [[; : separatore tra i profili
			// ([; : separatore tra il nome, la tipologia di utenza e il comune
		}
		if (stringP != "") {
			localStorage.setItem("profiles", stringP);
		} else {
			localStorage.setItem("profiles", "!!-null");
		}
		$rootScope.menuProfilesUpdate = true;
	};

	$scope.back = function () {
		$ionicNavBarDelegate.$getByHandle('navBar').back();
	};

	$scope.locs = [];

	$scope.tipologiaUtenza = [
		"utenza domestica",
		"utenza non domestica",
		"utenza occasionale"
	];

	$scope.profilo = {
		name: "",
		utenza: $scope.tipologiaUtenza[0],
		comune: "Selezionare"
	};

	$scope.save = function () {
		//alert($scope.profilo.name + "\n" + $scope.profilo.utenza + "\n" + $scope.profilo.comune);
		if ($scope.profilo.name != "" && $scope.profilo.comune != "Selezionare") {
			$scope.readProfiles();
			if (!$scope.containsName($scope.p, $scope.profilo.name)) {
				return;
			}
			$scope.p.push({
				name: $scope.profilo.name,
				type: $scope.profilo.utenza,
				loc: $scope.profilo.comune
			});
			$scope.saveProfiles();
			$scope.back();
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
		"utenza domestica",
		"utenza non domestica",
		"utenza occasionale"
	];

	$scope.profilo = {
		name: "",
		utenza: $scope.tipologiaUtenza[0],
		comune: "Selezionare"
	};

	$scope.isCurrentProfile = true;

	$scope.editMode = false;

	$scope.editIMG = "img/ic_edit.png";

	$scope.p = [];

	$scope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}

	$scope.readProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		$scope.p = [];
		var stringP = localStorage.getItem("profiles");
		if (!!stringP && stringP != "!!-null") {
			var rawP = [];
			rawP = stringP.split("[[;");
			for (var i = 0; i < rawP.length; i++) {
				$scope.p.push({
					name: rawP[i].split("([;")[0],
					type: rawP[i].split("([;")[1],
					loc: rawP[i].split("([;")[2]
				});
			}
		}
	};

	$scope.saveProfiles = function () {
		if (!$scope.supports_html5_storage()) {
			return;
		}
		var stringP = "";
		for (var i = 0; i < $scope.p.length; i++) {
			if (stringP != "") {
				stringP = stringP + "[[;" + $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			} else {
				stringP = $scope.p[i].name + "([;" + $scope.p[i].type + "([;" + $scope.p[i].loc;
			}
			// [[; : separatore tra i profili
			// ([; : separatore tra il nome, la tipologia di utenza e il comune
		}
		if (stringP != "") {
			localStorage.setItem("profiles", stringP);
		} else {
			localStorage.setItem("profiles", "!!-null");
		}
		$rootScope.menuProfilesUpdate = true;
	};

	$scope.edit = function () {
		if (!$scope.editMode) {
			$scope.editMode = true;
			$scope.editIMG = "img/ic_save.png";
		} else {
			var p = $scope.findProfileById($scope.id);
			if ($scope.profilo.name != p.name || $scope.profilo.utenza != p.type || $scope.profilo.comune != p.loc) {
				if ($scope.profilo.name != "" && $scope.profilo.comune != "Selezionare") {
					var index = $scope.p.indexOf(p);
					$scope.p[index].name = $scope.profilo.name;
					$scope.p[index].type = $scope.profilo.utenza;
					$scope.p[index].loc = $scope.profilo.comune;
					$scope.saveProfiles();
					$scope.editMode = false;
					$scope.editIMG = "img/ic_edit.png";
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
				var p = $scope.findProfileById($scope.id);
				$scope.p.splice($scope.p.indexOf(p), 1);
				$scope.saveProfiles();
				$scope.back();
			}
		});
	};

	$scope.init = function () {
		$http.get('data/db/aree.json').success(function (data) {
			for (var i = 0; i < data.length; i++) {
				if (!!data[i].comune) {
					$scope.locs.push(data[i].comune);
				}
			}
		});
		var p = $scope.findProfileById($scope.id);
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
	};

	$scope.findProfileById = function (id) {
		$scope.readProfiles();
		for (var i = 0; i < $scope.p.length; i++) {
			if ($scope.p[i].name == id) {
				return $scope.p[i];
			}
		}
		return null;
	};

	$scope.init();
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
			}
		];
	$scope.mainScrollResize = function () {
		$ionicScrollDelegate.$getByHandle('mainScroll').resize();
	}
})

.controller('TutorialCtrl', function ($scope, $ionicLoading) {

	$scope.close = function () {
		$ionicLoading.hide();
	};

	$scope.index = 0;

	$scope.next = function () {
		if ($scope.tutorial[$scope.index].skippable) {
			$scope.index++;
		} else {
			$scope.close();
		}
	};

	$scope.tutorial = [
		{
			index: 1,
			title: "Benvenuto!",
			x: 3,
			y: 40,
			text: "Questo tutorial ti inlustrerà il funzionamento della app. Per sapere dove buttare una specifico rifiuto, scrivine il nome qui e premi sulla lente d'ingrandimento.",
			imgX: 72,
			imgY: 11,
			skippable: true
		},
		{
			index: 1,
			title: "Tipologie di rifiuto",
			x: 3,
			y: 17,
			text: "Scopri quali rifiuti appartengono ad una certa categoria e dove devono essere conferiti.",
			imgX: 34,
			imgY: 37,
			skippable: true
		},
		{
			index: 1,
			title: "Scadenze e note",
			x: 3,
			y: 40,
			text: "Tieni sotto controllo le scadenze della raccolta porta a porta e aggiungi delle note personali.",
			imgX: 0,
			imgY: 2,
			skippable: true
		},
		{
			index: 1,
			title: "Calendario",
			x: 3,
			y: 40,
			text: "Verifica quali rifiuti vengono raccolti oggi e quali punti di raccolta sono aperti.",
			imgX: 68,
			imgY: 2,
			skippable: true
		},
		{
			index: 1,
			title: "Menù laterale",
			x: 3,
			y: 40,
			text: "Premi qui per aprire il menù laterale e scoprire ulteriori funzionalità",
			imgX: 0,
			imgY: -4,
			skippable: false
		}
	];
})
