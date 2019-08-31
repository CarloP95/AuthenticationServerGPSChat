const fs        = require('fs');
const sqlite3   = require('sqlite3').verbose();
const getHash   = require('../Utils/utils.js').getHash;

var db          = new sqlite3.cached.Database('usr.db');     //or :memory: to a faster db.

const tableName = 'Users', column_UserID = 'UserID', column_pwd = 'Password';

// It is necessary to wrap inside a serialize
db.serialize( _ => {
	db.run(`CREATE TABLE IF NOT EXISTS ${tableName}(
					${column_UserID} TEXT UNIQUE,
					${column_pwd}    TEXT
	);`);
});

//Init with test users.
const usersAndCredentials   = JSON.parse(fs.readFileSync('./config/auth.json')).users;
var   queryHead_insert      = `INSERT OR IGNORE INTO ${tableName} (${column_UserID}, ${column_pwd}) VALUES`;
var   queryHead_insert_safe = `INSERT INTO ${tableName} (${column_UserID}, ${column_pwd}) VALUES`;
var   queries               = [];

for (let userAndCredential of usersAndCredentials) {
	queries.push(`${queryHead_insert}('${userAndCredential.id}', '${getHash(userAndCredential.pwd)}');`);
}

// Execute builded queries
db.parallelize( _ => {
	for (query of queries) {
		db.run(query);
	}
});


/* Public API used for authenticate users that are already registered.
 * Usage
 * var results = authenticateUser('3331114444', 'xxxxxxxxxx');
 * results.then( res => {
 *  console.log(res);
 * });
 * */

function authenticateUser(userId, pwd) {

	const hash = getHash(pwd);
	
	return new Promise( (resolve, reject) => {

		db.get(`SELECT ${column_UserID}, ${column_pwd} FROM ${tableName} WHERE ${column_pwd} == '${hash}' AND ${column_UserID} == '${userId}';`,
			(err, row) => {
				if (err)
					throw `An Error occurred during searching the DB. ${err}`;


				if (row)
						resolve({authenticated: true});

				else
						resolve({authenticated: false});

				reject(row);

			});

	});

}


function registerUser(userId, pwd) {

	const hash = getHash(pwd);
	
	return new Promise( (resolve, reject) => {
		
		db.serialize( _ => {

				const builded_query = `${queryHead_insert_safe}('${userId}', '${hash}');`;
				
				db.run(builded_query, (err) => {
					if (err)
						reject(err);

					resolve({"registered": true});

				});

			});

	});

}

module.exports = {

	authenticateUser: authenticateUser,
	registerUser    : registerUser

}
