angular.module('rifiuti.services.utili', [])


.factory('Utili', function () {
  var iconType = function(tipologia) {
      var icona;
      switch (tipologia) {
        case 'Isola ecologica':
          icona = 'isola_eco';
          break;
        case 'CRM':
          icona = 'crm';
          break;
        case 'CRZ':
          icona = 'crz';
          break;
        case 'Farmacia':
          icona = 'farmacia';
          break;
        case 'Rivenditore':
          icona = 'rivenditore';
          break;
        default:
          if (tipologia.indexOf('Porta a porta')==0) {
            icona = 'porta_a_porta';
          }
          break;
      }
      return icona;
  }; 
  
  return {
    getRGBColor: function(colore) {
      switch (colore) {
        case 'ARANCIONE':
          return 'orange';
        //TODO: manca l'azzurro, e per ora ho uso la versione BLUE
        case 'AZZURRO':
          return 'blue';
        case 'BLU':
          return 'blue';
        case 'GIALLO':
          return 'yellow';
        case 'MARRONE':
          return 'brown';
        case 'ROSSO':
          return 'red';
        case 'VERDE':
          return 'green';
        case 'VERDE SCURO':
          return 'darkgreen';
        default:
          return 'grey';
      }
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
