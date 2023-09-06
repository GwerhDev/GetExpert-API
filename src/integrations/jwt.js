const jwt = require("jsonwebtoken");
const { PRIVATE_SECRET } = require("../config/config");

const newToken = async (data, time) => {
  const expiration = time * 60 * 60;
  const payload = {
    data,
    exp: Math.floor(Date.now() / 1000) + expiration
  };
  const token = jwt.sign(payload, PRIVATE_SECRET);
  return token;
};

const decodeToken = async (token) => {
  try {
    const decoded = jwt.verify(token, PRIVATE_SECRET);
    return decoded;
  } catch (error) {
    return error;
  }
};

module.exports = {
  newToken,
  decodeToken
};