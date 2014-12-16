angular.module('starter.controllers.home', [])

.controller('HomeCtrl', function ($scope, $rootScope, $ionicSideMenuDelegate, $http, $ionicLoading) {
  $rootScope.noteSelected = false;

  $scope.height = window.innerHeight;
  $scope.width = window.innerWidth;

  $scope.rifiuti = [];
  $scope.f = [];
  $scope.listaRifiuti = [];
  
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

  $scope.titleText = function () {
    if (!$rootScope.noteSelected) {
      return '100% Riciclo';
    } else {
      return '';
    }
  };
  $scope.subTitleText = function () {
    if (!$rootScope.noteSelected) {
      return ($scope.selectedProfile ? $scope.selectedProfile.name : '');
    } else {
      return '';
    }
  };

  $scope.leftClick = function () {
    if (!$rootScope.noteSelected) {
      $ionicSideMenuDelegate.toggleLeft();
    } else {
      $rootScope.noteReset();
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
    localStorage.clear();
  };

  

  $rootScope.showTutorial = false;
  var stringTutorial = localStorage.getItem("tutorial");
  if (stringTutorial == "false" || !!$rootScope.promptedToProfile) {
    $rootScope.showTutorial = false;
  } else {
    $rootScope.showTutorial = true;
  }
  $scope.stopTutorial = function () {
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
})

.controller('noteCtrl', function ($scope, $rootScope, $ionicPopup) {
  $scope.variableIMG = "img/ic_add.png";
  $scope.updateIMG = function () {
    $scope.variableIMG = !$rootScope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
  };

  $scope.notes = [];
  $scope.selectedNotes = [];
  $scope.multipleNoteSelected = false;
  
  if (localStorage.notes && localStorage.notes.charAt(0)=='[') $scope.notes=JSON.parse(localStorage.notes);

  $scope.saveNotes = function () {
    localStorage.notes=JSON.stringify($scope.notes)
  };
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
      $rootScope.noteSelected = true;
      if ($scope.selectedNotes.length > 1) $scope.multipleNoteSelected = true;
    } else {
      $scope.selectedNotes.splice(p, 1);
      if ($scope.selectedNotes.length <= 1) {
        $scope.multipleNoteSelected = false;
        if ($scope.selectedNotes.length < 1) $rootScope.noteSelected = false;
      }
    }
    $scope.updateIMG();
  };
  $scope.click = function () {
    if ($rootScope.noteSelected) {
      while ($scope.selectedNotes.length > 0) {
        $scope.removeNote($scope.selectedNotes[0].id);
        $scope.noteSelect($scope.selectedNotes[0]);
      }
    } else {
      $scope.data = {};
      $ionicPopup.show({
        template: '<input type="text" ng-model="data.nota">',
        title: 'Cosa vuoi ricordare?',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.nota) {
                return null;
              } else {
                return $scope.data.nota;
              }
            }
          }
        ]
      }).then(function (res) {
        if (res != null && res != undefined) {
          $scope.addNote(res);
        }
      });
    }
  };
  $scope.edit = function () {
    $scope.data = { 'nota':$scope.selectedNotes[0].note };

    var popup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.nota">',
      title: 'Cosa vuoi ricordare?',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function (e) {
            if (!$scope.data.nota) {
              return null;
            } else {
              return $scope.data.nota;
            }
          }
        }
      ]
    }).then(function (res) {
      if (res != null && res != undefined) {
        $scope.notes[$scope.notes.indexOf($scope.selectedNotes[0])].note = res;
        $scope.noteSelect($scope.selectedNotes[0]);
        $scope.saveNotes();
      }
    });
  };
})

.controller('calendarioCtrl', function ($scope, $ionicScrollDelegate) {
  $scope.calendarClick = null;
  $scope.calendarView = false;

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
    $scope.variableIMG2 = $scope.calendarView ? "img/tableView.png" : "img/listView.png";
  };
  
  $scope.getEmptyArrayByLenght = function (lenght) {
    var array = [];
    if (lenght < 100) {} else lenght = 100;
    for (var i = 0; i < lenght; i++) {
      array.push(i - 1);
    }
    return array;
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
  var mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  var giorni = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
  var giorniC = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

  $scope.DayDiff = function () {
    if ($scope.calendarClick == null)
      var CurrentDate = new Date();
    else
      var CurrentDate = new Date(y, m, $scope.calendarClick, 0, 0, 0, 0);
    var TYear = CurrentDate.getFullYear();
    var nextYear = "January, 01, " + (TYear + 1)
    var TDay = new Date(nextYear);
    TDay.getFullYear(TYear);
    var DayCount = (TDay - CurrentDate) / (1000 * 60 * 60 * 24);
    DayCount = Math.round(DayCount);
    return (DayCount + 14);
  }

  $scope.arrayD = $scope.getEmptyArrayByLenght($scope.DayDiff());

  $scope.counterGiorniMese = 0;

  function isLastDay(dt) { //controlla se è l'ultimo giorno del mese
    return new Date(dt.getTime() + 86400000).getDate() === 1;
  }

  $scope.giornoCounter = 0;

  function giorniMese(mm, yyyy) {
    //if (month[][week].index!=1) $scope.giornoCounter=0;
    if ($scope.giornoCounter != 0 || $scope.counterGiorniMese > 31) return null;
    for (var i = 1; i < 7; i += 2)
      if ($scope.counterGiorniMese >= 30 && mm == i) return null;
    for (var k = 8; k < 11; k += 2)
      if ($scope.counterGiorniMese >= 30 && mm == k) return null;
    for (var i = 0; i < 7; i += 2)
      if ($scope.counterGiorniMese >= 31 && mm == i) return null;
    for (var i = 7; i < 12; i += 2)
      if ($scope.counterGiorniMese >= 31 && mm == i) return null;
    if (mm == 1 && yyyy % 4 == 0 && $scope.counterGiorniMese >= 29) return null;
    if (mm == 1 && yyyy % 4 != 0 && $scope.counterGiorniMese >= 28) return null;
    $scope.counterGiorniMese++;
    datax = new Date(yyyy, mm, $scope.counterGiorniMese, 0, 0, 0, 0);
    if (isLastDay(datax)) {
      tmp = $scope.counterGiorniMese;
      $scope.counterGiorniMese = 0;
      $scope.giornoCounter = -1;
      return tmp;
    } else {
      return $scope.counterGiorniMese;
    }
  }

  function firstGiorniMese(mm, yyyy) {
    $scope.giornoCounter = 0;

    if ($scope.counterGiorniMese > 31) return null;

    if (mm == 1 && yyyy % 4 == 0 && $scope.counterGiorniMese >= 29) return null;
    if (mm == 1 && yyyy % 4 != 0 && $scope.counterGiorniMese >= 28) return null;
    $scope.counterGiorniMese++;
    datax = new Date(yyyy, mm, $scope.counterGiorniMese, 0, 0, 0, 0);
    tmp = $scope.counterGiorniMese;
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
  var m = mm;
  var y = yyyy;

  function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  //function monthYear(){return mesi[mm]+" "+yyyy};//es Novembre 2014

  function monthYear(a, b) {
    return mesi[a] + " " + b
  };




  /*$scope.dayDayMonthYear= function(date) { //es.: Martedì 12 settembre 2014
        var day = giorniC[date.getDay()];
        var Day = date.getDate();
        var month = mesi[date.getMonth()];
        var year = date.getFullYear();
        
        return day+" "+Day+" "+month+" "+year;
    }*/

  $scope.dayDayMonthYear = function (giorno) { //es.: Martedì 12 settembre 2014
    var date = giorno;
    var day = giorniC[date.getDay()];
    var Day = date.getDate();
    var month = mesi[date.getMonth()];
    var year = date.getFullYear();

    return day + " " + Day + " " + month + " " + year;

  }


  function returnDayName(day, month, year) { // es.: LUN
    if ($scope.giornoCounter != 0) return null;
    var oo = new Date(year, month, day, 0, 0, 0, 0);
    var tt = oo.getDay();
    var ui = giorni[tt];
    if (tt == 0) $scope.giornoCounter++;
    return ui;
  }


  $scope.aggiungiMese = function () {
    if (mm == 11) {
      mm++;
      yyyy++;
    } else mm++;
  }

  /* $scope.aggiungiGiorno = function (date) {
        if (getDate(date) == 31 && getMonth(date) == 11) return null;
        else date.setDate(date.getDate() + 1);
        return date;
    }*/

  $scope.aggiungiGiorni = function (i) {

    if ($scope.calendarClick != null)
      var d = new Date(y, m, $scope.calendarClick, 0, 0, 0, 0);
    else
      var d = new Date();
    //a = d.getDate();
    d.setDate(d.getDate() + i);
    return d;
  }


  var currentMonth = mesi[mm];
  var currentYear = yyyy;
  $scope.month = {
    name: monthYear(mm, yyyy),
    weeks: [
   [ //for(int i=0;i<daysInMonth($scope.mm,$scope.yyyy);i++)
        {
          date: firstGiorniMese(mm, yyyy),
          day: returnDayName(1, mm, yyyy),
          events: []
    }
            , {
          date: giorniMese(mm, yyyy),
          day: returnDayName(2, mm, yyyy),
          events: []
    }
            , {
          date: giorniMese(mm, yyyy),
          day: returnDayName(3, mm, yyyy),
          events: []
    }
            , {
          date: giorniMese(mm, yyyy),
          day: returnDayName(4, mm, yyyy),
          events: []
    }
            ,
        {
          date: giorniMese(mm, yyyy),
          day: returnDayName(5, mm, yyyy),
          events: []
    }
            ,
        {
          date: giorniMese(mm, yyyy),
          day: returnDayName(6, mm, yyyy),
          events: [
            {
              color: "blue"
      }
     ]
    },
        {
          date: giorniMese(mm, yyyy),
          day: returnDayName(7, mm, yyyy),
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
          date: firstGiorniMese(mm, yyyy),
          day: "LUN",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "MAR",
          events: [
            {
              //Dati del evento
              color: "red"
      }
     ]
    },
        {
          date: giorniMese(mm, yyyy),
          day: "MER",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "GIO",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
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
          date: giorniMese(mm, yyyy),
          day: "SAB",
          events: [{
            color: "green"
      }]
    },
        {
          date: giorniMese(mm, yyyy),
          day: "DOM",
          events: []
    }
   ]
   ,
   [
        {
          date: firstGiorniMese(mm, yyyy),
          day: "LUN",
          events: [{
            color: "yellow"
      }]
    },
        {
          date: giorniMese(mm, yyyy),
          day: "MAR",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
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
          date: giorniMese(mm, yyyy),
          day: "GIO",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "VEN",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "SAB",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "DOM",
          events: []
    }
   ]
   ,
   [
        {
          date: firstGiorniMese(mm, yyyy),
          day: "LUN",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "MAR",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "MER",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "GIO",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "VEN",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "SAB",
          events: []
    },
        {
          date: giorniMese(mm, yyyy),
          day: "DOM",
          events: []
    }
   ]
   ,
   [
        {
          index: 5,
          date: firstGiorniMese(mm, yyyy),
          day: "LUN",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "MAR",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "MER",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "GIO",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "VEN",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "SAB",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "DOM",
          events: []
    }
            ]
            ,
   [
        {
          index: 5,
          date: firstGiorniMese(mm, yyyy),
          day: "LUN",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "MAR",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "MER",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "GIO",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "VEN",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "SAB",
          events: []
    },
        {
          index: 5,
          date: giorniMese(mm, yyyy),
          day: "DOM",
          events: []
    }
   ]
  ]
  };

  $scope.lastMonth = function () {
    $scope.counterVerde--;
    $scope.giornoCounter = 0;
    $scope.counterGiorniMese = 0;

    if (m == 0) {
      m = 11;
      y--;
    } else
      m--;

    $scope.month.name = monthYear(m, y);

    for (var i = 0; i < 6; i++) {
      for (var k = 0; k < 7; k++) {
        if (k == 0)
          $scope.month.weeks[i][k].date = firstGiorniMese(m, y);
        else
          $scope.month.weeks[i][k].date = giorniMese(m, y);
        if (i == 0) {
          $scope.month.weeks[i][k].day = returnDayName(k + 1, m, y);
        }

      }
    }

  }

  $scope.nextMonth = function () {
    $scope.counterVerde++;
    $scope.giornoCounter = 0;
    $scope.counterGiorniMese = 0;

    if (m == 11) {
      m = 0;
      y++;
    } else
      m++;

    $scope.month.name = monthYear(m, y);
    for (var i = 0; i < 6; i++) {
      for (var k = 0; k < 7; k++) {
        if (k == 0)
          $scope.month.weeks[i][k].date = firstGiorniMese(m, y);
        else
          $scope.month.weeks[i][k].date = giorniMese(m, y);
        if (i == 0) {
          $scope.month.weeks[i][k].day = returnDayName(k + 1, m, y);
        }

      }
    }
  }

  $scope.goToToday = function () {
    if ($scope.calendarView == false) {
      $scope.counterGiorniMese = 0;
      $scope.counterVerde = 0;
      m = mm;
      y = yyyy;
      $scope.month.name = monthYear(m, y);

      for (var i = 0; i < 6; i++) {
        for (var k = 0; k < 7; k++) {
          if (k == 0)
            $scope.month.weeks[i][k].date = firstGiorniMese(m, y);
          else
            $scope.month.weeks[i][k].date = giorniMese(m, y);
          if (i == 0) {
            $scope.month.weeks[i][k].day = returnDayName(k + 1, m, y);
          }

        }
      }
    } else if ($scope.calendarView == true) {
      $scope.calendarClick = null;
      $ionicScrollDelegate.scrollTop();



    }
  }
})
