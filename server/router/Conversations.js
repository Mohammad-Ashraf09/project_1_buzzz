const router = require("express").Router();
const Conversation = require("../model/Conversation");

// add a new new conversation
router.post("/", async(req, res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }
    catch(err){
        res.status(500).json(err);
    }
});

// get all the conversations list of a particular user
router.get("/:userId", async(req, res)=>{
    try{
        const conversation = await Conversation.find({
            members: {$in: [req.params.userId]},
        });
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json(err);
    }
});

//delete a member from list
router.delete("/delete/:id", async (req, res) => {
    try {
      await Conversation.findByIdAndRemove(req.params.id);
      res.status(200).json("conversation has been deleted");
    }
    catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;