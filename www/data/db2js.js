const SqliteToJson = require('sqlite-to-json');
const sqlite3 = require('sqlite3');
const fs = require('fs');

const exporter = new SqliteToJson({
  client: new sqlite3.Database('rifiuti')
});
exporter.tables(function (err, tables) {
	for (idx in tables) {
		table=tables[idx];
	  console.log('table: '+table);
		exporter.save(table, 'db/'+table+'.json', function (err) {
			if (err) throw err;
			// no error and you're good.
		});
	}
});

var db = new sqlite3.Database('rifiuti');
db.serialize(function() {
  // write punto di raccolta calendar view
  var sql = "SELECT DISTINCT "
					+ "puntiRaccolta.*, raccolta.colore, raccolta.area as r_area FROM puntiRaccolta "
					+ "	INNER JOIN raccolta ON puntiRaccolta.tipologiaPuntiRaccolta = raccolta.tipologiaPuntoRaccolta AND raccolta.tipologiaUtenza = puntiRaccolta.tipologiaUtenza "
					+ " WHERE (puntiRaccolta.dataDa IS NOT NULL AND puntiRaccolta.dataDa != '')"
					+ " AND (puntiRaccolta.dataA IS NOT NULL AND puntiRaccolta.dataA != '')"
					+ " AND (puntiRaccolta.il IS NOT NULL AND puntiRaccolta.il != '')";

  db.all(sql, function(err, rows) {
    var map = {};
    for (var i = 0; i < rows.length; i++) {
      if (!(rows[i].tipologiaUtenza in map)) {
        map[rows[i].tipologiaUtenza] = [];
      }
      map[rows[i].tipologiaUtenza].push(rows[i]);
    }
    for (var type in map) {
      fs.writeFile('db/puntiRaccoltaCalendar_'+type+'.json', JSON.stringify(map[type]), function (err) {
        if (err) throw err;
        console.log('view: puntiRaccoltaCalendar_'+type);
      });
    }    
  });

  sql = "SELECT DISTINCT * FROM puntiRaccolta";
  db.all(sql, function(err, rows) {
    var map = {};
    for (var i = 0; i < rows.length; i++) {
      if (!(rows[i].tipologiaUtenza in map)) {
        map[rows[i].tipologiaUtenza] = [];
      }
      map[rows[i].tipologiaUtenza].push(rows[i]);
    }
    for (var type in map) {
      fs.writeFile('db/puntiRaccolta_'+type+'.json', JSON.stringify(map[type]), function (err) {
        if (err) throw err;
        console.log('view: puntiRaccolta_'+type);
      });
    }    
  });
  
});

db.close();
/*
*/
