angular.module('rifiuti.services.calendar', [])

.factory('Calendar', function ($http, $rootScope, Raccolta) {
    var mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
    var giorni = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    var giorniC = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

    var DOW = {"DOM":6, "LUN":0, "MAR":1, "MER":2, "GIO":3, "VEN":4, "SAB":5};

    var daysInMonth = function(month, year) {
        return new Date(year, month + 1, 0).getDate();
    };

    return {
        dayIndex: function(day) {
            return DOW[day];
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
        fillWeeks: function(date) {
            var weeks = [];
            var totalDays = daysInMonth(date.getMonth(),date.getFullYear());
            var firstDay = this.dayIndex(giorni[date.getDay()]);
            var weekNumber = 0;
            for(var i = 1; i <= totalDays; i++) {
                if (weeks.length == weekNumber) {
                    weeks.push(new Array());
                }
                var week = weeks[weekNumber];
                var runningDate = new Date(date.getFullYear(), date.getMonth(), i, 0, 0, 0, 0);
                if (runningDate.getDay() == 0) weekNumber++;
                week.push({
                    date: runningDate,
                    dateString: runningDate.toLocaleDateString(),
                    day: giorni[runningDate.getDay()],
                    events:[]
                });
            }
            return weeks;
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
