const crypto = require("crypto");
const JWT = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateOTP = (digits = 6) => {
  const minNum = Math.pow(10, digits - 1);
  const maxNum = Math.pow(10, digits) - 1;
  const result = crypto.randomInt(minNum, maxNum);
  return result;
};

const signJWT = (data) =>
  JWT.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_DURATION,
  });

const verifyJWT = () => {};

const generateRandomToken = () => uuidv4();

module.exports = { generateOTP, signJWT, verifyJWT, generateRandomToken };
