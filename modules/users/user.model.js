const { required } = require("joi");
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isBlocked: {type: boolean, required: true, default: false},
    isEmailVerified: {type: boolean, required: true, defalut: false },
    otp: {type: String},
    roles: {type: [String], enum: ["admin", "user"], default: "user"},
  },
  {
    timestamps: true,
  },
);

module.exports = model("User", userSchema);
