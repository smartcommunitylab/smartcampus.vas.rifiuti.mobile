angular.module('starter.controllers', ['google-maps'])

.controller("ExampleController", function($scope, $cordovaCamera) {
 
    $scope.takePicture = function() {
        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
 
})

.controller('AppCtrl', function ($scope, $rootScope, $location) {
	$scope.showTutorial = function () {
		$rootScope.showTutorial = true;
	};

    
    
	$scope.createOneProfile = function () {
		if (!$rootScope.supports_html5_storage()) {
			return;
		}
		if (!localStorage.getItem("profiles")) {
			$rootScope.promptedToProfile = true;
			$location.url("app/aggProfilo");
		}
	};

	$scope.createOneProfile();

	$rootScope.readProfiles();
	$rootScope.selectProfile(0);
})

.controller('HomeCtrl', function ($scope, $rootScope, $ionicTabsDelegate, $ionicSideMenuDelegate, $timeout, $ionicPopup, $http, $location, $ionicLoading, $ionicScrollDelegate) {

    $scope.height  = window.innerHeight;
    $scope.width  = window.innerWidth;
    
	var delegate = $ionicTabsDelegate.$getByHandle('home-tabs');

	$scope.variableIMG = "img/ic_add.png";

	$scope.updateIMG = function () {
		$scope.variableIMG = !$scope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
	};

	$scope.rifiuti = [];
	$scope.f = [];
	$scope.listaRifiuti = [];
    $scope.calendarClick = null;
    $scope.calendarView = false;

	$rootScope.showTutorial;
    
        
    $scope.click2 = function () {
        
        $scope.calendarClick = null;
		$scope.calendarView = !$scope.calendarView;
		$scope.updateIMG2();
        
        $ionicScrollDelegate.scrollTop();
    }
    
    $scope.click3 = function (i) {
        
        $scope.calendarClick = i;
		$scope.calendarView = !$scope.calendarView;
		$scope.updateIMG2();
        
    }
    
    $scope.variableIMG2 = "img/listView.png";

	$scope.updateIMG2 = function () {
		$scope.variableIMG2 = $scope.calendarView ? "img/tableView.png"  :"img/listView.png" ;
	};
    
    
	$scope.doTutorial = function () {
		if (!$rootScope.supports_html5_storage()) {
			$rootScope.showTutorial = false;
			return;
		}
		var stringTutorial = localStorage.getItem("tutorial");
		if (stringTutorial == "false" || !!$rootScope.promptedToProfile) {
			$rootScope.showTutorial = false;
		} else {
			$rootScope.showTutorial = true;
		}
	};

	$scope.doTutorial();

	$scope.stopTutorial = function () {
		if (!$rootScope.supports_html5_storage()) {
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

	$scope.selectedNotes = [];

	$scope.noteSelected = false;
	$scope.multipleNoteSelected = false;

	$scope.readNotes = function () {
		if (!$rootScope.supports_html5_storage()) {
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
		}//else  $scope.noteImg= "img/ic_note.png";
            
            //if (!!stringNote && stringNote != "!!-null"){ //////////
           // }
	};

	$scope.saveNotes = function () {
		if (!$rootScope.supports_html5_storage()) {
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
    
    $scope.subTitleText = function () {
		if (!$scope.noteSelected) {
			return $scope.selectedProfile.name;
		} else {
			return '';
		}
	};
    
   /* $rootScope.prova = function () {
        delegate.select(1);
    }*/
    
    $rootScope.delegateHome = function () {
        delegate.select(1);
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
		if (!$rootScope.supports_html5_storage()) {
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
        if(lenght < 100){}
        else lenght = 100;
		for (var i = 0; i < lenght; i++) {
			array.push(i);
		}
		return array;
	};
    
    
    $scope.DayDiff = function()
    {
            if ($scope.calendarClick == null)
                var CurrentDate = new Date();
            else
                var CurrentDate = new Date(y,m,$scope.calendarClick,0,0,0,0);
            var TYear=CurrentDate.getFullYear();
            var nextYear = "January, 01, "+(TYear+1)
            var TDay=new Date(nextYear);
            TDay.getFullYear(TYear);
            var DayCount=(TDay-CurrentDate)/(1000*60*60*24);
            //DayCount=Math.round(DayCount); 
        return(DayCount+14);
    }

    
        var mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"];
    
    var giorni=["DOM","LUN","MAR","MER","GIO","VEN","SAB"];
    var giorniC=["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"];
    
    $scope.counterGiorniMese=0;  
    
    function isLastDay(dt) { //controlla se è l'ultimo giorno del mese
    return new Date(dt.getTime() + 86400000).getDate() === 1;
    }
    
    $scope.giornoCounter=0;
    
    function giorniMese (mm,yyyy) {
        //if (month[][week].index!=1) $scope.giornoCounter=0;
        if ($scope.giornoCounter!=0 || $scope.counterGiorniMese>31) return null;
        for(var i=1; i<7; i+=2)
            if ($scope.counterGiorniMese >= 30 && mm==i) return null;
        for(var k=8; k<11; k+=2)
            if ($scope.counterGiorniMese >= 30 && mm==k) return null;
        for(var i=0; i<7; i+=2)
            if ($scope.counterGiorniMese >= 31 && mm==i) return null;
        for(var i=7; i<12; i+=2)
            if ($scope.counterGiorniMese >= 31 && mm==i) return null;
        if (mm==1 && yyyy%4==0 && $scope.counterGiorniMese >=29) return null;
        if (mm==1 && yyyy%4!=0 && $scope.counterGiorniMese >=28) return null;
        $scope.counterGiorniMese++; 
        datax= new Date(yyyy,mm,$scope.counterGiorniMese,0,0,0,0);
        if(isLastDay(datax)){
            tmp= $scope.counterGiorniMese;
            $scope.counterGiorniMese=0;
            $scope.giornoCounter=-1;
            return tmp;
        }
        else
            return $scope.counterGiorniMese;
    }
    
    function firstGiorniMese (mm,yyyy) {
        $scope.giornoCounter=0;
        
        if ($scope.counterGiorniMese>31) return null;
        
        if (mm==1 && yyyy%4==0 && $scope.counterGiorniMese >=29) return null;
        if (mm==1 && yyyy%4!=0 && $scope.counterGiorniMese >=28) return null;
        $scope.counterGiorniMese++; 
        datax= new Date(yyyy,mm,$scope.counterGiorniMese,0,0,0,0);
        tmp= $scope.counterGiorniMese;
        //$scope.counterGiorniMese=0;
            return tmp;
    }
    
    $scope.mm;
    $scope.yyyy;
    
    $scope.counterVerde = 0;
    
    var oggi = new Date();
    $scope.today = oggi.getDate();
    $scope.meseN = oggi.getMonth();
    mm = oggi.getMonth(); //January is 0!
    costante = oggi.getMonth();
    yyyy = oggi.getFullYear();
    $scope.giornoSettimanaOggi = oggi.getDay();
    var m=mm;
    var y=yyyy;
    
    function daysInMonth(month,year) {
    return new Date(year, month+1, 0).getDate();
}
    
    //function monthYear(){return mesi[mm]+" "+yyyy};//es Novembre 2014
    
    function monthYear(a,b){return mesi[a]+" "+b};
    
   
   
    
    /*$scope.dayDayMonthYear= function(date) { //es.: Martedì 12 settembre 2014
        var day = giorniC[date.getDay()];
        var Day = date.getDate();
        var month = mesi[date.getMonth()];
        var year = date.getFullYear();
        
        return day+" "+Day+" "+month+" "+year;
    }*/
    
    $scope.dayDayMonthYear= function(giorno) { //es.: Martedì 12 settembre 2014
        var date = giorno;
        var day = giorniC[date.getDay()];
        var Day = date.getDate();
        var month = mesi[date.getMonth()];
        var year = date.getFullYear();
        return day+" "+Day+" "+month+" "+year;
    }
    
    
    function returnDayName (day,month,year){ // es.: LUN
        if ($scope.giornoCounter!=0) return null;
        var oo = new Date(year,month,day,0,0,0,0);
        var tt = oo.getDay();
        var ui = giorni[tt];
        if (tt==0) $scope.giornoCounter++;
        return  ui;
    }
    
    
    $scope.aggiungiMese = function (){
        if (mm==11){
            mm++; yyyy++;
        }
        else mm++;
    }
    
   /* $scope.aggiungiGiorno = function (date) {
        if (getDate(date) == 31 && getMonth(date) == 11) return null;
        else date.setDate(date.getDate() + 1);
        return date;
    }*/
    
    $scope.aggiungiGiorni = function (i){
        
        if($scope.calendarClick!=null)
            var d = new Date(y,m,$scope.calendarClick,0,0,0,0);
        else
            var d = new Date();
        a = d.getDate();
        d.setDate(a + i);
        return d;
    }

    
    var currentMonth = mesi[mm];
    var currentYear = yyyy;
	$scope.month = {
		name:  monthYear(mm,yyyy),
		weeks: [ 
			[ //for(int i=0;i<daysInMonth($scope.mm,$scope.yyyy);i++)
                {
					date: firstGiorniMese(mm,yyyy),
					day: returnDayName(1,mm,yyyy), 
					events: []
				}
            ,{
					date:giorniMese(mm,yyyy),
					day: returnDayName(2,mm,yyyy), 
					events: []
				}
            ,{
                    date: giorniMese(mm,yyyy),
					day: returnDayName(3,mm,yyyy), 
					events: []
				}
            ,{      
					date: giorniMese(mm,yyyy),
					day: returnDayName(4,mm,yyyy), 
					events: []
				}
            ,
				{
                    date: giorniMese(mm,yyyy),
					day: returnDayName(5,mm,yyyy), 
					events: []
				}
            , 
				{
                    date: giorniMese(mm,yyyy),
					day: returnDayName(6,mm,yyyy),
					events: [
						{
							color: "blue"
						}
					]
				},
                {
                    date: giorniMese(mm,yyyy),
					day: returnDayName(7,mm,yyyy),
					events: [
						{
							color: "blue"
						}
					]
				}
				//{
				//	date: 3,
				//	day: "DOM",
				//	events: []
				//}
			],
			[
				{
					date: firstGiorniMese(mm,yyyy),
					day: "LUN",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "MAR",
					events: [
						{
							//Dati del evento
							color: "red"
						}
					]
				},
				{
					date: giorniMese(mm,yyyy),
					day: "MER",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "GIO",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
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
					date: giorniMese(mm,yyyy),
					day: "SAB",
					events: [{
						color: "green"
						}]
				},
				{
					date: giorniMese(mm,yyyy),
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					date: firstGiorniMese(mm,yyyy),
					day: "LUN",
					events: [{
						color: "yellow"
						}]
				},
				{
					date: giorniMese(mm,yyyy),
					day: "MAR",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
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
					date: giorniMese(mm,yyyy),
					day: "GIO",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "VEN",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "SAB",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					date: firstGiorniMese(mm,yyyy),
					day: "LUN",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "MAR",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "MER",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "GIO",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "VEN",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "SAB",
					events: []
				},
				{
					date: giorniMese(mm,yyyy),
					day: "DOM",
					events: []
				}
			]
			,
			[
				{
					index:5,
					date: firstGiorniMese(mm,yyyy),
					day: "LUN",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "MAR",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "MER",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "GIO",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "VEN",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "SAB",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "DOM",
					events: []
				}
            ]
            ,
			[
				{
					index:5,
					date: firstGiorniMese(mm,yyyy),
					day: "LUN",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "MAR",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "MER",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "GIO",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "VEN",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "SAB",
					events: []
				},
				{
					index:5,
					date: giorniMese(mm,yyyy),
					day: "DOM",
					events: []
				}
			]
		]
	};
    
        $scope.lastMonth = function (){
            $scope.counterVerde--;
            $scope.giornoCounter=0;
            $scope.counterGiorniMese=0;
            
            if(m==0){
                m=11; y--;
            }
            else
                m--;
            
            $scope.month.name = monthYear(m,y);
            
            for (var i =0; i<6;i++){
                for( var k=0; k<7;k++){
                    if(k==0)
                        $scope.month.weeks[i][k].date = firstGiorniMese(m,y);
                    else
                        $scope.month.weeks[i][k].date = giorniMese(m,y);
                    if (i==0){
                        $scope.month.weeks[i][k].day =  returnDayName(k+1,m,y); 
                    }
                        
                    }
            }
            
        }
        
        $scope.nextMonth = function (){
            $scope.counterVerde++;
            $scope.giornoCounter=0;
            $scope.counterGiorniMese=0;
            
            if(m==11){
                m=0; y++;
            }
            else
                m++;
            
            $scope.month.name = monthYear(m,y);
            for (var i =0; i<6;i++){
                for( var k=0; k<7;k++){
                    if(k==0)
                        $scope.month.weeks[i][k].date = firstGiorniMese(m,y);
                    else
                        $scope.month.weeks[i][k].date = giorniMese(m,y);
                    if (i==0){
                        $scope.month.weeks[i][k].day =  returnDayName(k+1,m,y); 
                    }
                        
                    }
            }
        }
        
        $scope.goToToday = function (){
            if($scope.calendarView==false){   
                $scope.counterGiorniMese=0;
                $scope.counterVerde=0;
                m=mm; y=yyyy; 
                $scope.month.name = monthYear(m,y);

                for (var i =0; i<6;i++){
                    for( var k=0; k<7;k++){
                        if(k==0)
                            $scope.month.weeks[i][k].date = firstGiorniMese(m,y);
                        else
                            $scope.month.weeks[i][k].date = giorniMese(m,y);
                        if (i==0){
                            $scope.month.weeks[i][k].day =  returnDayName(k+1,m,y); 
                        }

                    }
                }   
            }
            else if($scope.calendarView==true){
                $scope.calendarClick = null;
                $ionicScrollDelegate.scrollTop();
                
               
                
            }
        }
        
    
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

	$scope.init = function () {
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
			title: "y1",
			t1: "y2",
			t2: "y3",
			t3: "y4",
			web: "y5",
			tel: "y6",
			email: "y7",
			pec: "y8",
			fax: "y9",
			aperto: false
			},
		{
			title: "u1",
			t1: "u2",
			t2: "u3",
			t3: "u4",
			web: "www.comunitadellegiudicarie.it",
			tel: "0465/325038",
			email: "rifiuti@comunitadellegiudicarie.it",
			pec: "c.giudicarie.legamail.it",
			fax: "0465/329043",
			aperto: false
			},
		{
			title: "SOGAP SRL",
			t1: "i2",
			t2: "Via Cesena 13 38070 Preore (TN)",
			web: "www.sogap.net",
			tel: "0465/322755",
			email: "info@sogap.net",
			fax: "0465/323194",
			aperto: false
			}
		];
	$scope.mainScrollResize = function () {
		$ionicScrollDelegate.$getByHandle('mainScroll').resize();
	}
})

.controller('TutorialCtrl', function ($scope, $ionicLoading) {
    
    
   $scope.prova= function (){
            delegate.select(1);
    }

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
    
    var getX = function(id) {
        //toggleLeft([isOpen]);
        var div = document.getElementById(id);
        var rect = div.getBoundingClientRect();
        return rect.left+0.5*(rect.right-rect.left);
        var width  = window.innerWidth; 
    };
    var getY = function(id) {
        var div = document.getElementById(id);
        var rect = div.getBoundingClientRect();
        return rect.top+0.5*(rect.bottom-rect.top);
    };

	$scope.tutorial = [
		{   
			index: 1,
            primo: 44,
			title: "TTUno",
			x: 3,
			y: 40,
			text: "TutorialUno",
			imgX: function(){var width  = window.innerWidth; return width-80}, //getX("searchButton")-320},
			imgY: function(){return getY("searchButton")-50},
			skippable: true
		},
		{
			index: 1,
			title: "TTDue",
			x: 3,//3
			y: 40,
			text: "TutorialDue",
			imgX: function(){return getX("rifiutoId")-45},
			imgY: function(){return getY("rifiutoId")-40},
			skippable: true
		},
		{
			index: 1,
			title: "TTTre",
			x: 3,
			y: 40,
			text: "TutorialTre",
			imgX: function(){return getX("noteId")+25},
			imgY: function(){return getY("noteId")-50},
			skippable: true
		},
		{
			index: 1,
			title: "TTQuattro",
			x: 3,
			y: 40,
			text: "TutorialQuattro",
			imgX: function(){var width  = window.innerWidth; return 0.5*width+80},//return getX("calendarioId")+305},
			imgY: function(){return getY("calendarioId")-50},
			skippable: true
		},
		{
			index: 1,
			title: "TTCinque",
			x: 3,
			y: 40,
			text: "TutorialCinque",
			imgX: function(){return getX("menuId")-66},
			imgY: function(){return getY("menuId")-50},
			skippable: false
		}
	];
})
