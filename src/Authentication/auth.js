const jwt 		= require('jsonwebtoken');
const getHash 	= require('../Utils/utils.js').getHash;


function generateToken (requestBody) {

	const hash  = getHash(requestBody.pwd);
	// Sign using hash of password.
	return new Promise( (resolve, reject) => {

		jwt.sign(requestBody, hash, (err, token) => {
			
			if(err)
				reject(err);
			
			var curDate 	  = new Date();
			var formattedDate = `${curDate.toJSON()}`;

			console.log(`[${formattedDate}] Providing access token ${token} to ${requestBody.usr}.`);

			resolve(token);

		}); 
	});
}


exports.provideToken = generateToken;