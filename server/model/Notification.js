const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    senderId:{
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
    noOfNotifications:{   // this field is only for 1st entry in database having _id = 6374b1028931795513d7c592 in notifications collection
        type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);