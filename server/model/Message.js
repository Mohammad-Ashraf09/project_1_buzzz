const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId:{
        type: String,
    },
    sender:{
        type: String,
    },
    text:{
        type: String,
    },
    media:{
        type: Array,
    },
    replyForId:{
        type: String,
    },
    replyForText:{
        type: String,
    },
    isSameDp:{
        type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);