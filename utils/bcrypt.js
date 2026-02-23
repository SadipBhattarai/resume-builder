const bcrypt = require("bcryptjs");

const generateHash = (password) =>
  bcrypt.hashSync(password, +process.env.SALT_ROUND);

const compareHash = (password, hashPw) => {
  return bcrypt.compareSync(password, hashPw);
};

module.exports = { compareHash, generateHash };
