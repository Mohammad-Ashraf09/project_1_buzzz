const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      type: Array,
      default: [],
    },
    location: {
      type: String,
    },
    taggedFriends: {
      type: Array,
      default: [],
    },
    edited: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    comments:{
      type:Array,
      default:[],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);