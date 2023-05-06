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

// increasing the length of noOfNotifications array by 1
router.put("/noOfNotifications", async (req, res) => {
    try{
        // user2 is that one who logged in other side which receives notification of all there friends
        // user1 is that one who receives notification which is friend of user2(logged in)
        const notifications = await Message.findById("64328659e7d2a582292a379a");
        const notificationById = notifications.noOfNotifications.find((n)=>n.userId===req.body.user2);

        if(notificationById){   // agar main user present hai
            const receiver = notificationById.receiverId.find((n)=>n.id===req.body.user1);

            if(receiver){  // agar main user ke andar wo present hai jisko notification bhejna hai
                await Message.findOneAndUpdate(
                    {"noOfNotifications.userId": req.body.user2},
                    {$push: {"noOfNotifications.$.receiverId.$[xxx].notifications": ""}},
                    {arrayFilters: [{"xxx.id": req.body.user1}]},
                );
                res.status(200).json("notifications array increased by 1");
            }
            else{   // agar main user ke andar wo present hi NHI hai jisko notification bhejna hai
                await Message.updateOne(
                    {"noOfNotifications.userId": req.body.user2},
                    {$push: {"noOfNotifications.$.receiverId": {id: req.body.user1, notifications: [""]}}}
                );
                res.status(200).json("new object pushed inside receiverId");
            }
        } else{  // agar main user hi present nhi hai
            await notifications.updateOne({$push: {noOfNotifications: {
                userId: req.body.user2,
                receiverId: [{id: req.body.user1, notifications: [""]}]
            }}});
            res.status(200).json("new object pushed pushed inside noOfNotifications");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

// get notifications of logged in user
router.get("/noOfNotifications/:id", async(req, res)=>{
    try{
        const notifications = await Message.findById("64328659e7d2a582292a379a");
        const notificationById = notifications.noOfNotifications.find((n)=>n.userId===req.params.id);
        res.status(200).json(notificationById);
    }catch(err){
        res.status(500).json(err);
    }
});

// remove notification of a particular friend
router.put("/noOfNotifications/:id", async (req, res) => {  // id wo hai jisne login kiya hua hai
    try{
        await Message.updateOne(
            {"noOfNotifications.userId": req.params.id},
            {$pull: {"noOfNotifications.$.receiverId": {id: req.body.friendId}}},
        );
        res.status(200).json("object removed from receiverId");
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router;