// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'google-maps'])

.run(function ($ionicPlatform, $rootScope) {
	$ionicPlatform.ready(function () {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});

	$rootScope.p = [];
	$rootScope.selectedProfile = null;
	$rootScope.supports_html5_storage = function () {
		try {
			return 'localStorage' in window && window['localStorage'] !== null;
		} catch (e) {
			return false;
		}
	}
	$rootScope.readProfiles = function () {
		if (!$rootScope.supports_html5_storage()) {
			return;
		}
		$rootScope.p = [];
		var stringP = localStorage.getItem("profiles");
		if (!!stringP && stringP != "!!-null") {
			var rawP = [];
			rawP = stringP.split("[[;");
			for (var i = 0; i < rawP.length; i++) {
				$rootScope.p.push({
					name: rawP[i].split("([;")[0],
					type: rawP[i].split("([;")[1],
					loc: rawP[i].split("([;")[2],
					image: "img/rifiuti_btn_radio_off_holo_dark.png"
				});
			}
		}
	};
	$rootScope.findProfileById = function (id) {
		$rootScope.readProfiles();
		for (var i = 0; i < $rootScope.p.length; i++) {
			if ($rootScope.p[i].name == id) {
				return $rootScope.p[i];
			}
		}
		return null;
	};
	$rootScope.findIndexById = function (id) {
		$rootScope.readProfiles();
		for (var i = 0; i < $rootScope.p.length; i++) {
			if ($rootScope.p[i].name == id) {
				return i;
			}
		}
		return -1;
	};
	$rootScope.selectProfile = function (index) {
		if (index >= $rootScope.p.length) {
			return;
		}
		if (!!$rootScope.selectedProfile) {
			$rootScope.findProfileById($rootScope.selectedProfile.name).image = "img/rifiuti_btn_radio_off_holo_dark.png";
		}
		$rootScope.p[index].image = "img/rifiuti_btn_radio_on_holo_dark.png";
		$rootScope.selectedProfile = $rootScope.p[index];
	};
	$rootScope.menuProfilesUpdate = function () {
		//$rootScope.readProfiles();
		$rootScope.selectProfile($rootScope.findIndexById($rootScope.selectedProfile.name));
		//$rootScope.selectProfile(0);
	};
})

.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		controller: 'AppCtrl'
	})

	.state('app.home', {
		url: "/home",
		views: {
			'menuContent': {
				templateUrl: "templates/home.html",
				controller: 'HomeCtrl'
			}
		}
	})

	.state('app.puntiDiRaccolta', {
		url: "/puntiDiRaccolta/:id",
		views: {
			'menuContent': {
				templateUrl: "templates/puntiDiRaccolta.html",
				controller: 'PDRCtrl'
			}
		}
	})

	.state('app.tipiDiRaccolta', {
		url: "/tipiDiRaccolta",
		views: {
			'menuContent': {
				templateUrl: "templates/tipiDiRaccolta.html",
				controller: 'TDRCtrl'
			}
		}
	})

	.state('app.raccolta', {
		url: "/raccolta/:id",
		views: {
			'menuContent': {
				templateUrl: "templates/raccolta.html",
				controller: 'RaccoltaCtrl'
			}
		}
	})

	.state('app.rifiuto', {
		url: "/rifiuto/:id",
		views: {
			'menuContent': {
				templateUrl: "templates/rifiuto.html",
				controller: 'RifiutoCtrl'
			}
		}
	})

	.state('app.puntoDiRaccolta', {
		url: "/puntoDiRaccolta/:id",
		views: {
			'menuContent': {
				templateUrl: "templates/puntoDiRaccolta.html",
				controller: 'PuntoDiRaccoltaCtrl'
			}
		}
	})

	.state('app.profili', {
		url: "/profili",
		views: {
			'menuContent': {
				templateUrl: "templates/profili.html",
				controller: 'ProfiliCtrl'
			}
		}
	})

	.state('app.aggProfilo', {
		url: "/aggProfilo",
		views: {
			'menuContent': {
				templateUrl: "templates/aggProfilo.html",
				controller: 'AggiungiProfiloCtrl'
			}
		}
	})

	.state('app.modificaProfilo', {
		url: "/modificaProfilo/:id",
		views: {
			'menuContent': {
				templateUrl: "templates/modificaProfilo.html",
				controller: 'ModificaProfiloCtrl'
			}
		}
	})

	.state('app.segnala', {
		url: "/segnala",
		views: {
			'menuContent': {
				templateUrl: "templates/segnala.html",
				controller: 'SegnalaCtrl'
			}
		}
	})

	.state('app.contatti', {
		url: "/contatti",
		views: {
			'menuContent': {
				templateUrl: "templates/contatti.html",
				controller: 'ContattiCtrl'
			}
		}
	})

	.state('app.info', {
		url: "/info",
		views: {
			'menuContent': {
				templateUrl: "templates/info.html",
				controller: 'InfoCtrl'
			}
		}
	});
	$urlRouterProvider.otherwise('/app/home');
});
