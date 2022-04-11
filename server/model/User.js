const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    fname: {
      type: String,
      min: 3,
      max: 10,
      default: "",
    },
    lname: {
      type: String,
      min: 3,
      max: 10,
      default: "",
    },
    gender:{
      type:String,
      default: "Male",
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
      min: 6,
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
    isAdmin: {
      type: Boolean,
      default: false,
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
      default: new Date()
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