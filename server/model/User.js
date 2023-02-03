const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    gender:{
      type:String,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    totalPosts:{
      type: Number,
      default: 0
    },
    bio: {
      type: String,
      max: 50,
      default: "",
    },
    phone:{
      type: String,
      required: true,
      unique: true,
      min: 10
    },
    DOB:{
      type: String,
      min: 10,
      max: 10
    },
    city: {
      type: String,
      max: 50,
      default: "",
    },
    place: {
      type: String,
      max: 50,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);