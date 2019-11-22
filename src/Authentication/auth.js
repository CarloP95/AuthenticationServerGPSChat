const jwt 			= require('jsonwebtoken');
const getHash 		= require('../Utils/utils.js').getHash;
const base64decode  = require('../Utils/utils.js').base64decode;
const copyObj       = require('../Utils/utils.js').copyObj;

const signOptions = {
	expiresIn: "30m"
};


function generateToken (requestBody) {

	const hash  = getHash(requestBody.pwd);
	// Sign using hash of password.
	return new Promise( (resolve, reject) => {

		requestBody = copyObj(requestBody);
		delete requestBody.pwd

		jwt.sign(requestBody, hash, signOptions, (err, token) => {
			
			if(err)
				reject(err);
			
			var curDate 	  = new Date();
			var formattedDate = `${curDate.toJSON()}`;
			var fakeToken 	  = getHash(token);
			var verifiedToken = jwt.verify(token, hash);

			console.log(`[${formattedDate}] Providing access token ${token} to ${requestBody.usr}.`);
			console.log(`Real token: ${token}, Fake Token: ${getHash(token)}`);
			console.log(`${token} issued, expires at ${verifiedToken.exp}`);
			resolve({ "token": token, "fakeToken": fakeToken, "expiration": verifiedToken.exp});

		}); 
	});
}


exports.provideToken = generateToken;