const fs        = require('fs');
const sqlite3   = require('sqlite3').verbose();
const getHash   = require('../Utils/utils.js').getHash;

var db          = new sqlite3.cached.Database('usr.db');     //or :memory: to a faster db.

//TODO: Must create a new DB, maybe in memory to be faster, to store token.
//TODO: Must expose API to request if tokens are valid.
//Later TODO: Must create a mock token to let it pass around the network.

const tableName = 'Users', column_UserID = 'UserID', column_pwd = 'Password', column_NickName = 'Nickname';
var   queryHead_insert      = `INSERT OR IGNORE INTO ${tableName} (${column_UserID}, ${column_pwd}, ${column_NickName}) VALUES`;
var   queryHead_insert_safe = `INSERT INTO ${tableName} (${column_UserID}, ${column_pwd}, ${column_NickName}) VALUES`;


function init() {
	// It is necessary to wrap inside a serialize
	db.serialize( _ => {
		db.run(`CREATE TABLE IF NOT EXISTS ${tableName}(
						${column_UserID}   TEXT UNIQUE,
						${column_pwd}      TEXT,
						${column_NickName} TEXT UNIQUE
		);`);
	});

	//Init with test users.
	const usersAndCredentials   = JSON.parse(fs.readFileSync('./config/auth.json')).users;
	var   queries               = [];

	for (let userAndCredential of usersAndCredentials) {
		queries.push(`${queryHead_insert}('${userAndCredential.id}', '${getHash(userAndCredential.pwd)}', '${userAndCredential.nick}');`);
	}

	// Execute builded queries
	db.parallelize( _ => {
		for (query of queries) {
			db.run(query);
		}
	});
}


//Call init.
init();


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

		db.get(`SELECT ${column_NickName} FROM ${tableName} WHERE ${column_pwd} == '${hash}' AND ${column_UserID} == '${userId}';`,
			(err, row) => {
				if (err)
					throw `An Error occurred during searching the DB. ${err}`;


				if (row)
						resolve({authenticated: true, nick: row.Nickname});

				else
						resolve({authenticated: false});

				reject(row);

			});

	});

}


function registerUser(userId, pwd, nickname) {

	const hash = getHash(pwd);
	
	return new Promise( (resolve, reject) => {
		
		db.serialize( _ => {

				const builded_query = `${queryHead_insert_safe}('${userId}', '${hash}', ${nickname});`;
				
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
