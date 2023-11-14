const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    emailId: { type: String, required: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

module.exports = { User };
