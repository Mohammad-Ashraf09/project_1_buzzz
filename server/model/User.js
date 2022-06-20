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
    followingName: {
      type: Array,
      default: [],
    },
    totalPosts:{
      type: Number,
      default: 0
    },
    desc: {
      type: String,
      max: 50,
      default: "",
    },
    designation:{
      type:String,
      max: 15,
      default: "",
    },
    phone:{
      type: Number,
      required: true,
      unique: true,
      min: 10
    },
    DOB:{
      type: Date,
      // default: new Date()
    },
    city: {
      type: String,
      max: 50,
      default: "",
    },
    from: {
      type: String,
      max: 50,
      default: "",
    },
    zip:{
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);