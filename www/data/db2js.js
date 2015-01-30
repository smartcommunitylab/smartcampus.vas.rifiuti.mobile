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
    fs.writeFile('db/puntiRaccoltaCalendar.json', JSON.stringify(rows), function (err) {
      if (err) throw err;
      console.log('view: puntiRaccoltaCalendar');
    });
  });

});

db.close();
/*
*/
