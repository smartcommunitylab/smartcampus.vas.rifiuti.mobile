angular.module('rifiuti.services.utili', [])


.factory('Utili', function () {
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

  var format = function(date) {
    return date.getFullYear()+'-'+(date.getMonth() < 9 ? '0'+(date.getMonth()+1):(date.getMonth()+1))+'-'+(date.getDate() < 10 ? '0'+date.getDate():date.getDate());
  };

  var generateDOWDates = function(da, a, dow, ecc) {
      var res = [];
      var currFrom = new Date(da.getTime());
      currFrom.setDate(currFrom.getDate()-dayIndex(giorni[currFrom.getDay()])+dow);
      while (currFrom.getTime() < a.getTime()) {
        if (currFrom.getTime() > da.getTime()) {
          var dStr = format(currFrom);
          if (!ecc || ecc.indexOf(dStr) < 0) res.push(dStr);
        }
        // move to next week
        currFrom.setDate(currFrom.getDate()+7);
      }
      return res;
  };
  
  /**
   * generate a list of date string for the specified period, date, definition, and list of exceptions (format dd/MM[/yyyy])
   * definition is space-separated elements, where element is either DOW (e.g., lunedi) or date (format dd/MM[/yyyy])
   */
  var calToDates = function(da, a, il, ecc) {
    if (!il) return [];

    var arr = il.split(' ');
    var dates = [];  
    var eccDates = calToDates(da, a, ecc, null);
    for (var i = 0; i < arr.length; i++) {
      var elem = arr[i];
      var idx = giorniC.indexOf(elem);          
      // DOW case
      if (idx >= 0) {
        dates = dates.concat(generateDOWDates(da, a, DOW[giorni[idx]], eccDates));
      // date case
      } else {
        var dElems = elem.split('/');
        if (dElems.length < 2 || dElems.length > 3) return;
        if (dElems.length == 2) dElems.push(''+da.getFullYear());
        var dStr = format(new Date(dElems[2], dElems[1]-1, dElems[0]));
        if (!ecc || ecc.indexOf(dStr) < 0) dates.push(dStr);
      }
    }
    dates.sort();
    return dates;
  };


  var iconType = function(tipologia) {
    if (tipologia in ICON_POINT_MAP) return ICON_POINT_MAP[tipologia];
    return null;
  }; 
  

  return {
    jsDOWToShortText: function(dow) {
      return giorni[dow];
    },
    jsDOWToDOW: function(dow) {
      return DOW[giorni[dow]];
    },
    DOWTextToDOW: function(dow) {
      return DOW[dow];
    },
    dayIndex: dayIndex,
    textToDOW: function(txt) {
      return DOW[giorni[giorniC.indexOf(txt)]];
    },
    dayToDOW: function(day) {
      return dayIndex(giorni[day]);
    },
    monthYear: function(a, b) {
        return mesi[a] + " " + b
    },
    isLastDayInMonth : function(dt) { 
        return new Date(dt.getTime() + 86400000).getDate() === 1;
    },
    lastDateOfMonth: function(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    },
    calToDates: calToDates,
    expandOrarioApertura: function(cal) {
      if (!cal.il || cal.dates) return;
      var max = new Date(Date.parse(cal.dataA));
      var min = new Date(Date.parse(cal.dataDa));
      cal.dates = calToDates(min,max, cal.il, cal.eccezione);
    }, 

    getRGBColor: function(colore) {
      if (colore in ICON_COLOR_MAP) return ICON_COLOR_MAP[colore];
      return 'grey';
    },
    iconFromRegola: function(regola) {
      return this.icon(regola.tipologiaPuntoRaccolta, regola.colore);
    },
    icon: function(tipologia, colore) {
      var icona = iconType(tipologia);
      return (!!icona?'img/ic_'+icona+'_'+this.getRGBColor(colore)+'.png':null);
    },
    poiIcon: function(tipologia, colore) {
      var icona = iconType(tipologia);
      return (!!icona?'img/ic_poi_'+icona+'.png':null);
    },
    belongsTo: function(pr, profile) {
      return profile.aree.indexOf(pr.area) != -1 && (pr.tipologiaPuntiRaccolta=='CRM' || pr.tipologiaPuntiRaccolta=='CRZ' || !pr.indirizzo || profile.comuni.indexOf(pr.indirizzo)!=-1);
    },
    isPaP: function(tipologia) {
      return !!tipologia && tipologia.toLowerCase().indexOf('porta a porta') == 0;
    }
  }
})
