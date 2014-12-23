angular.module('rifiuti.services.utili', [])

.factory('Utili', function () {
  return {
    iconFromRegola: function(regola) {
      var icona;
      switch (regola.tipologiaPuntoRaccolta) {
        case 'Isola Ecologica':
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
          if (regola.tipologiaPuntoRaccolta.indexOf('Porta a porta')==0) {
            icona = 'porta_a_porta';
          }
          break;
      }
      var colore;
      switch (regola.colore) {
        case 'ARANCIONE':
          colore = 'orange';
          break;
        //TODO: manca l'azzurro, e per ora ho uso la versione BLUE
        case 'AZZURRO':
          colore = 'blue';
          break;
        case 'BLU':
          colore = 'blue';
          break;
        case 'GIALLO':
          colore = 'yellow';
          break;
        case 'MARRONE':
          colore = 'brown';
          break;
        case 'ROSSO':
          colore = 'red';
          break;
        case 'VERDE':
          colore = 'green';
          break;
        case 'VERDE SCURO':
          colore = 'olivegreen';
          break;
        default:
          colore = 'grey';
          break;
      }
      return (!!icona?'img/ic_'+icona+'_'+colore+'.png':null);
    }
  }
})
