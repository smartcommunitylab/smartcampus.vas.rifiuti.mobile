const SqliteToJson = require('sqlite-to-json');
const sqlite3 = require('sqlite3');

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
/*
*/
