angular.module('rifiuti.controllers.home', [])

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
      $rootScope.noteSelected = false;
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

.controller('noteCtrl', function ($scope, $rootScope, $ionicPopup, Profili) {
  $rootScope.noteSelected = false;
  $scope.variableIMG = "img/ic_add.png";
  var updateIMG = function () {
    $scope.variableIMG = !$rootScope.noteSelected ? "img/ic_add.png" : "img/ic_menu_delete.png";
  };

  $rootScope.$watch('noteSelected', function() {
    if (!$rootScope.noteSelected) {
        $scope.selectedNotes = [];
        $scope.multipleNoteSelected = false;
    }
  });    
    
  $scope.notes = Profili.getNotes();
  $scope.selectedNotes = [];
  $scope.multipleNoteSelected = false;
  
  $scope.addNote = function (nota) {
      $scope.notes = Profili.addNote(nota);
  };
  $scope.removeNotes = function (idx) {
      $scope.notes = Profili.deleteNotes(idx);
      $scope.selectedNotes = [];
      $scope.multipleNoteSelected = false;
      $rootScope.noteSelected = false;
  };
  $scope.noteSelect = function (idx) {
    var p = $scope.selectedNotes.indexOf(idx);
    if (p == -1) {
      $scope.selectedNotes.push(idx);
      $rootScope.noteSelected = true;
      if ($scope.selectedNotes.length > 1) $scope.multipleNoteSelected = true;
    } else {
      $scope.selectedNotes.splice(p, 1);
      if ($scope.selectedNotes.length <= 1) {
        $scope.multipleNoteSelected = false;
        if ($scope.selectedNotes.length < 1) $rootScope.noteSelected = false;
      }
    }
    updateIMG();
  };
  $scope.click = function () {
    if ($rootScope.noteSelected) {
        $scope.removeNotes($scope.selectedNotes);
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
    $scope.data = { 'nota': $scope.notes[$scope.selectedNotes[0]], idx: $scope.selectedNotes[0]};

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
          $scope.notes = Profili.updateNote($scope.data.idx, res);
          $scope.selectedNotes = [];
          $scope.multipleNoteSelected = false;
          $rootScope.noteSelected = false;
      }
    });
  };
})

.controller('calendarioCtrl', function ($scope, $rootScope, $ionicScrollDelegate, Calendar) {
  $rootScope.noteSelected = false;
  
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
        
    
  $scope.firstDayIndex = function (week) {
    return Calendar.dayIndex(week[0].day);
  };
  $scope.lastDayIndex = function (week) {
    return Calendar.dayIndex(week[week.length - 1].day);
  };

  $scope.getEmptyArrayByLength = function(length) {
    var array = [];
    if (length > 100) length = 100;
    for (var i = 0; i < length; i++) {
      array.push(i - 1);
    }
    return array;
  }
  
  $scope.currDate = new Date();
  $scope.dayList = [];//$scope.getEmptyArrayByLength(Calendar.dayArrayHorizon($scope.currDate.getFullYear(),$scope.currDate.getMonth(), $scope.currDate.getDate()));
  $scope.dayListLastMonth = null;
  $scope.showDate = new Date();
  
  var buildMonthData = function() {
    return {
      name: Calendar.monthYear($scope.showDate.getMonth(), $scope.showDate.getFullYear()),
      weeks: Calendar.fillWeeks($scope.showDate)
    };
  };
  
  $scope.month = buildMonthData();
  $scope.$watch('month', function(a,b){
    if (a.name !== b.name || $scope.dayList.length == 0) {
      $scope.dayList = Calendar.toListData($scope.month.weeks);     
      $scope.dayListLastMonth = Calendar.lastDateOfMonth($scope.showDate);
    }
  });
    
  $scope.loadMoreDays = function() {
    $scope.dayListLastMonth.setDate($scope.dayListLastMonth.getDate()+1);
    $scope.dayListLastMonth = Calendar.lastDateOfMonth($scope.dayListLastMonth);
    var newWeeks = Calendar.fillWeeks($scope.dayListLastMonth);
    $scope.dayList = $scope.dayList.concat(Calendar.toListData(newWeeks));
    $scope.$broadcast('scroll.infiniteScrollComplete');
  };  
    
  $scope.goToToday = function () {
    if ($scope.calendarView == false) {
      $scope.showDate = new Date();
      $scope.month = buildMonthData();
    } else if ($scope.calendarView == true) {
      $ionicScrollDelegate.scrollTop();
    }
  };
  $scope.nextMonth = function () {
    $scope.showDate.setDate(1);
    $scope.showDate.setMonth($scope.showDate.getMonth()+1);
    $scope.month = buildMonthData();
  };

  $scope.lastMonth = function () {
    $scope.showDate.setDate(1);
    $scope.showDate.setMonth($scope.showDate.getMonth()-1);
    $scope.month = buildMonthData();
  };

})
