const sqlite3   = require('sqlite3').verbose();
const getHash   = require('../Utils/utils.js').base64decode;
var db          = new sqlite3.cached.Database(':memory:tkn.db');

const tableName = 'Tokens', column_RealTkn = 'RealToken', column_FakeTkn = 'FakeToken', column_Expiration = 'Expiration', column_Nickname = 'Nickname';
var   queryHead_insert      = `INSERT OR IGNORE INTO ${tableName} (${column_FakeTkn}, ${column_RealTkn}, ${column_Expiration}, ${column_Nickname}) VALUES`;
var   queryHead_insert_safe = `INSERT INTO ${tableName} (${column_FakeTkn}, ${column_RealTkn}, ${column_Expiration}, ${column_Nickname}) VALUES`;


function init() {

	db.serialize( _ => {
		db.run(`CREATE TABLE IF NOT EXISTS ${tableName}(
						${column_FakeTkn}    TEXT,
						${column_RealTkn}    TEXT,
						${column_Expiration} DATE,
						${column_Nickname}   TEXT
		);`);
	});

	//TODO: Add an interval to check db entries expiration column and eventually delete entries from db.

}

init();

function isTokenValid(token, nickname) {

	return new Promise( (resolve, reject) => {
	
		db.get(`SELECT ${column_Expiration} FROM ${tableName} WHERE ${column_FakeTkn} == '${token}' AND ${column_Nickname} == '${nickname}';`, 

			(err, row) => {

				if(err)
					reject(err);

				if(row)
					resolve({
						valid: row.Expiration <= Date.now() 
					});

				resolve({valid: false});

			});

	});
}


function addToken(fakeToken, realToken) {
	
	return new Promise( (resolve, reject) => {
		
		db.serialize( _ => {

				expiration = true; //TODO: Calculate in some way base64decode(realToken)['...']

				const builded_query = `${queryHead_insert_safe}('${fakeToken}', '${realToken}', '${expiration}');`;
				
				db.run(builded_query, (err) => {
					if (err)
						reject(err);

					resolve(true);

				});

			});

	});
}

module.exports = {
	isTokenValid : isTokenValid,
	addToken     : addToken
};