angular.module('rifiuti.services.calendar', [])

.factory('Calendar', function ($rootScope, $q, $filter, Raccolta, Utili) {
    var mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    var giorni = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    var giorniC = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];

  
    var DOW = {"DOM":6, "LUN":0, "MAR":1, "MER":2, "GIO":3, "VEN":4, "SAB":5};

    var daysInMonth = function(month, year) {
        return new Date(year, month + 1, 0).getDate();
    };
    var dayIndex = function(day) {
            return DOW[day];
    };

    var appendToCalendarCell = function(cell, calItem, puntoDiRaccolta) {
      if (cell.colors.indexOf(puntoDiRaccolta.colore) < 0) cell.colors.push(puntoDiRaccolta.colore);
      
      var key = null, t = null, descr = null;
      var proto = null;
      if (Utili.isPaP(puntoDiRaccolta.tipologiaPuntiRaccolta)) {
        key = 'Porta a porta'; t = key;
        proto = {
          tipologiaPuntiRaccolta: puntoDiRaccolta.tipologiaPuntiRaccolta,
          colore: puntoDiRaccolta.colore,
          descr : [puntoDiRaccolta.tipologiaPuntiRaccolta.substr(14)]
        };
      } else  {
        key = puntoDiRaccolta.tipologiaPuntiRaccolta + puntoDiRaccolta.indirizzo;
        t = puntoDiRaccolta.tipologiaPuntiRaccolta;
        if (!!cell.events[key] && cell.events[key].events.length > 0) {
          proto = cell.events[key].events[0];
          proto.descr[proto.descr.length-1] += ', ' + calItem.dalle +'-'+calItem.alle;
          cell.events[key].events = [];
        } else {
          proto = {
            tipologiaPuntiRaccolta: puntoDiRaccolta.tipologiaPuntiRaccolta,
            colore: puntoDiRaccolta.colore,
            descr : [puntoDiRaccolta.dettaglioIndirizzo, calItem.dalle +'-'+calItem.alle]
          };
        }
      }
      if (!(key in cell.events)) cell.events[key] = {
        type: t,
        events : []
      };
      cell.events[key].events.push(proto);
    };
  
    return {
        dayIndex: dayIndex,
        textToDOW: function(txt) {
          return DOW[giorni[giorniC.indexOf(txt)]];
        },
        dayToDOW: function(day) {
          return dayIndex(giorni[day]);
        },
        dayArrayHorizon: function(y, m, d) {
            var currDate = (!y || !m || !d) ? new Date() : new Date(y,m,d,0,0,0,0);
            var TYear = currDate.getFullYear();
            var nextYear = "January, 01, " + (TYear + 1)
            var TDay = new Date(nextYear);
            TDay.getFullYear(TYear);
            var DayCount = (TDay - currDate) / (1000 * 60 * 60 * 24);
            DayCount = Math.round(DayCount) + 14;
            return DayCount;
        },
        isLastDayInMonth : function(dt) { 
            return new Date(dt.getTime() + 86400000).getDate() === 1;
        },
        monthYear: function(a, b) {
            return mesi[a] + " " + b
        },
        fillWeeks: function(date, utenza, aree) {
            var deferred = $q.defer();
            Raccolta.puntiRaccoltaCalendar(utenza, aree).then(function(data){
              var weeks = [];
              var totalDays = daysInMonth(date.getMonth(),date.getFullYear());
              var weekNumber = 0;
              
              for(var i = 1; i <= totalDays; i++) {
                  if (weeks.length == weekNumber) {
                      weeks.push(new Array());
                  }
                  var week = weeks[weekNumber];
                  var runningDate = new Date(date.getFullYear(), date.getMonth(), i, 0, 0, 0, 0);
                  if (runningDate.getDay() == 0) weekNumber++;
                  var day = giorni[runningDate.getDay()];
                  week.push({
                      date: runningDate,
                      dateString: runningDate.toLocaleDateString(),
                      day: day,
                      events:{},
                      colors:[]
                  });
              }
              
//              var firstDateStr = $filter('date')(new Date(date.getFullYear(),date.getMonth(),1), 'yyyy-MM-dd');//d.getFullYear() +'-'+d.getMonth()+'-01';
//              var lastDateStr = $filter('date')(new Date(date.getFullYear(),date.getMonth(),totalDays), 'yyyy-MM-dd');//d.getFullYear() +'-'+d.getMonth()+'-01';
              var firstDate = new Date(date.getFullYear(),date.getMonth(),1);
              var firstDay = dayIndex(giorni[firstDate.getDay()]);
              var lastDate = new Date(date.getFullYear(),date.getMonth(),totalDays);
              
              var d = data;
              for (var i = 0; i < d.length; i++) {
                if (d[i].orarioApertura) {
                  for (var j = 0; j < d[i].orarioApertura.length; j++) {
                    calItem = d[i].orarioApertura[j];
                    var calDa = new Date(Date.parse(calItem.dataDa));
                    var calA = new Date(Date.parse(calItem.dataA));
                    // restrict interval
                    if (calDa.getTime() < firstDate.getTime()) calDa = firstDate;
                    if (calA.getTime() > lastDate.getTime()) calA = lastDate;
                    if (calDa.getTime() <= calA.getTime()) {
                      // which DOW the current item is
                      var calDow = DOW[giorni[giorniC.indexOf(calItem.il)]];
                      for (var w = 0; w < weeks.length; w++) {
                        // find pos in week corresponding to the specified DOW
                        var idx = w == 0 ? calDow - firstDay : calDow;
                        if (idx >= 0) {
                          var cell = weeks[w][idx];
                          // if this is the date of the interval of interest
                          if (cell != null && cell.date.getDate() >= calDa.getDate() && cell.date.getDate() <= calA.getDate()) {
                            appendToCalendarCell(cell,calItem,d[i]);
                          }
                        }
                      }
                    }
                  }
                }
              }
              deferred.resolve(weeks);
            });
            return deferred.promise;
        },
        lastDateOfMonth: function(date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
        },
        toListData: function(weeks) {
            var list = [];
            for(var i = 0; i < weeks.length; i++) {
                for (var j = 0; j < weeks[i].length; j++) {
                    list.push(weeks[i][j]);
                }
            }
            return list;
        }
    };
})
