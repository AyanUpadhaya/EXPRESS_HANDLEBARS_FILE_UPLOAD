const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// user model
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

//post model
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
},{timestamps:true});

const Post = mongoose.model("Post", postSchema);

module.exports = { User, Post };
