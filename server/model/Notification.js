const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderId:{
        type: String,
    },
    name:{
        type: String,
    },
    avatar:{
        type: String,
    },
    receiverId:{
        type: String,
    },
    type:{
        type: String,
    },
    postId:{
        type: String,
    },
    noOfNotifications:{
        type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);