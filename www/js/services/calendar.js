angular.module('rifiuti.services.calendar', [])

.factory('Calendar', function ($rootScope, $q, $filter, Raccolta, Utili) {
    var daysInMonth = function(month, year) {
        return new Date(year, month + 1, 0).getDate();
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
        key = puntoDiRaccolta.tipologiaPuntiRaccolta + puntoDiRaccolta.dettaglioIndirizzo;
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
                  var day = Utili.jsDOWToShortText(runningDate.getDay());
                  week.push({
                      date: runningDate,
                      dateString: runningDate.toLocaleDateString(),
                      day: day,
                      events:{},
                      colors:[]
                  });
              }
              
              var firstDate = new Date(date.getFullYear(),date.getMonth(),1);
              firstDate.setHours(0);
              var firstDay = Utili.jsDOWToDOW(firstDate.getDay());
              var lastDate = new Date(date.getFullYear(),date.getMonth(),totalDays);
              lastDate.setHours(0);
              
              var d = data;
              for (var i = 0; i < d.length; i++) {
                if (d[i].orarioApertura) {
                  for (var j = 0; j < d[i].orarioApertura.length; j++) {
                    calItem = d[i].orarioApertura[j];
                    for (var k = 0; k < calItem.dates.length; k++) {
                      var currDate = new Date(Date.parse( calItem.dates[k]));
                      currDate.setHours(0);
                      if (currDate.getTime() >= firstDate.getTime() && currDate.getTime() <= lastDate.getTime()) {
                        var w = Math.floor((currDate.getDate()+firstDay) / 7);
                        var idx = Utili.jsDOWToDOW(currDate.getDay());
                        if (w == 0) idx = idx - firstDay;
                        var cell = weeks[w][idx];
                        // if this is the date of the interval of interest
                        if (cell != null) {
                          appendToCalendarCell(cell,calItem,d[i]);
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
