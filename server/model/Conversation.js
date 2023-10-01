const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    IDs:{
        type: Array,
    },
    // lastMsgText:{                                 // apply it mobile view
    //     type: String,
    // },
    // lastMsgSenderId:{
    //     type: String,
    // }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);