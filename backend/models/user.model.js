const mongoose = require("mongoose"); // Importing the mongoose library to interact with MongoDB
const Schema = mongoose.Schema; // Extracting the Schema constructor from mongoose

// Defining the schema for the User model
const userschema = new Schema({
  fullname: { type: String }, // Field to store the user's full name as a string
  email: { type: String }, // Field to store the user's email as a string
  password: { type: String }, // Field to store the user's password as a string
  createdON: { type: Date, default: new Date().getTime() }, // Field to store the creation date, defaulting to the current timestamp
  emailVerified: { type: Boolean, default: false },
  emailOtp: { type: String },
  otpExpires: { type: Date },
});

// Exporting the User model based on the defined schema
module.exports = mongoose.model("User", userschema);
