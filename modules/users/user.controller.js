const userModel = require("./user.model");
const { sendEmail } = require("../../services/mailer");
const { generateHash, compareHash } = require("../../utils/bcrypt");
const { mailEvents } = require("../../services/mailer");
const {
  generateOTP,
  signJWT,
  generateRandomToken,
} = require("../../utils/token");

const login = async (payload) => {
  const { email, password } = payload;
  const user = await userModel.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user?.isBlocked) throw new Error("User blocked. Contact admin");
  if (!user?.isEmailVerified) throw new Error("Email verifcation Pending");
  const isValidPassword = compareHash(password, user?.password);
  if (!isValidPassword) throw new Error("Email or password mismatch");
  const data = {
    name: user?.name,
    email: user?.email,
  };
  const refreshToken = generateRandomToken();
  await userModel.updateOne({email: user?.email}, {refreshToken})
  return {
    access_token: signJWT(data),
    refreshToken,
    data: "User Logged in sucessfully",
  };
};

const register = async (payload) => {
  const { password, ...rest } = payload;
  const existingUser = await userModel.findOne({ email: rest?.email });
  if (existingUser) throw new Error(`Email is already in use`);
  rest.password = generateHash(password);
  rest.otp = generateOTP();
  const newUser = await userModel.create(rest);
  if (newUser) {
    mailEvents.emit(
      "sendEmail",
      rest?.email,
      `Welcome to HireWire`,
      `Thank you for Signing up. Please use this ${rest.otp} code to verify your email.`,
    );
  }
};

const verifyEmail = async (payload) => {
  const { email, otp } = payload;
  if (otp.length !== 6) throw new Error("OTP must be 6 digits");
  const user = await userModel.findOne({ email, isEmailVerified: false });
  if (!user) throw new Error("User not Found");
  const isValidOTP = user.otp === String(otp);
  if (!isValidOTP) throw new Error("OTP didn't match");
  const userUpdate = await userModel.updateOne(
    { email },
    { isEmailVerified: true, otp: "" },
  );
  if (userUpdate)
    mailEvents.emit(
      "sendEmail",
      email,
      "Email Verified Sucessfully",
      "Thank you for verifying your email.",
    );
};

const resendEmailOTP = async (payload) => {
  const { email } = payload;

  const user = await userModel.findOne({ email, isEmailVerified: false });
  if (!user) throw new Error("User not Found");

  const otp = generateOTP();
  const userUpdate = await userModel.updateOne({ email }, { otp });
  if (userUpdate)
    mailEvents.emit(
      "sendEmail",
      email,
      `Your OTP code for email Verification is ${otp}`,
      `please use this ${otp} code to verify your email.`,
    );
};

module.exports = { login, register, verifyEmail, resendEmailOTP };
