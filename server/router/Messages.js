const router = require("express").Router();
const Message = require("../model/Message");

router.post("/", async(req, res)=>{
    const newMessage = new Message(req.body);

    try{
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    }catch(err){
        res.status(500).json(err);
    }
});

router.get("/:conversationId", async(req, res)=>{
    try{
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json(err);
    }
});

// delete a whole conversation
router.delete("/delete/:conversationId", async(req, res)=>{
    try {
        await Message.deleteMany({"conversationId": req.params.conversationId});
        res.status(200).json("Account has been updated");
    } catch (err) {
        return res.status(500).json(err);
    }
});

// delete a single message
router.delete("/delete/message/:id", async(req, res)=>{
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.status(200).json("message has been deleted");
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;