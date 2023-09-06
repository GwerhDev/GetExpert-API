const crypto = require('crypto');

function generateID(string) {
  const hash = crypto.createHash('sha256');
  hash.update(string);
  const hexDigest = hash.digest('hex');
  const truncatedDigest = hexDigest.slice(0, 10);
  const id = parseInt(truncatedDigest, 16) % 10000000000;
  return id;
}

function generateArrayID(array) {
  let idArray = [];
  for(let string of array) {
    const id = { name: string, _id: generateID(string)};
    idArray.push(id);
  }
  return idArray;
}

module.exports = {
  generateID,
  generateArrayID,
};