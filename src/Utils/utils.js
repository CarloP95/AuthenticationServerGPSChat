const crypto    = require('crypto');


function getHash(string, algorithm, inputEncoding) {
  const chosenAlgorithm        = 'sha1';
  const output_encoding        = 'hex' ;
  const defaultInput_encoding  = 'utf8';

  return crypto.createHash(algorithm || chosenAlgorithm)
    .update(string, inputEncoding || defaultInput_encoding)
    .digest(output_encoding);
}


function copyObj(object) {
	return JSON.parse(JSON.stringify(object));
}


function base64decode(encodedString) {
	return Buffer.from(encodedString, 'base64').toString();
}


function base64encode(toEncodeString) {
	return Buffer.from(toEncodeString).toString('base64');
}


module.exports = {
	getHash		: getHash,
	copyObj		: copyObj,
	base64encode: base64encode,
	base64decode: base64decode
};