const jwt 			= require('jsonwebtoken');
const getHash 		= require('../Utils/utils.js').getHash;
const base64decode  = require('../Utils/utils.js').base64decode;
const copyObj       = require('../Utils/utils.js').copyObj;


function generateToken (requestBody) {

	const hash  = getHash(requestBody.pwd);
	// Sign using hash of password.
	return new Promise( (resolve, reject) => {

		requestBody = copyObj(requestBody);
		delete requestBody.pwd

		jwt.sign(requestBody, hash, (err, token) => {
			
			if(err)
				reject(err);
			
			var curDate 	  = new Date();
			var formattedDate = `${curDate.toJSON()}`;
			var fakeToken 	  = getHash(token);

			console.log(`[${formattedDate}] Providing access token ${token} to ${requestBody.usr}.`);
			console.log(`Real token: ${token}, Fake Token: ${getHash(token)}`);
			console.log(`Real Token decoded: ${base64decode(token)}`);
			resolve({ "token": token, "fakeToken": fakeToken});

		}); 
	});
}


exports.provideToken = generateToken;