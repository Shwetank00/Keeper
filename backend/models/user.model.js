const mongoose = require("mongoose"); // Import mongoose to interact with MongoDB
const Schema = mongoose.Schema;

// Define the schema for the User model
const userschema = new Schema({
  fullname: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // Current active email
  pendingEmail: { type: String }, // New email waiting for verification
  password: { type: String, required: true }, // User's hashed password
  createdON: { type: Date, default: Date.now }, // Date of creation
  emailVerified: { type: Boolean, default: false }, // Whether email is verified
  emailOtp: { type: String }, // OTP code sent to user
  otpExpires: { type: Date }, // When the OTP expires
});

// Export the User model based on the defined schema
module.exports = mongoose.model("User", userschema);
