const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Handlebars = require("handlebars");

const handlebarsReplacements = ({ source, replacements }) => {
  return Handlebars.compile(source)(replacements);
};

const generateJWT = (payload, options) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
};

const parseToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  return verifyJWT(token);
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const generateHash = async (text, salts) => {
  return await bcrypt.hash(String(text), salts);
};

const compareHash = async (text, hash) => {
  return await bcrypt.compare(text, hash);
};

module.exports = {
  handlebarsReplacements,
  generateHash,
  generateJWT,
  verifyJWT,
  parseToken,
  compareHash,
};
