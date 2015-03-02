angular.module('rifiuti.services.utili', [])


.factory('Utili', function () {
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
      var icona;
      switch (tipologia) {
        case 'Isola ecologica':
          icona = 'isola_eco';
          break;
        case 'CRM':
          icona = 'crm';
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
      return (!!icona?'img/ic_'+icona+'_'+this.getRGBColor(colore)+'.png':null);
    }
  }
})
