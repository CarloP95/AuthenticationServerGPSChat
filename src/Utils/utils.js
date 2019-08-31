const crypto    = require('crypto');


function getHash(string, algorithm, inputEncoding) {
  const chosenAlgorithm        = 'sha1';
  const output_encoding        = 'hex' ;
  const defaultInput_encoding  = 'utf8';

  return crypto.createHash(algorithm || chosenAlgorithm)
    .update(string, inputEncoding || defaultInput_encoding)
    .digest(output_encoding);
}


exports.getHash = getHash;