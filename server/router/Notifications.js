const router = require("express").Router();
const Notification = require("../model/Notification");

// creating new notification
router.post("/", async(req, res)=>{
    const newNotification = new Notification(req.body);

    try{
        const savedNotification = await newNotification.save();
        res.status(200).json(savedNotification);
    }catch(err){
        res.status(500).json(err);
    }
});

// finding all the notifications by id
router.get("/:receiverId", async(req, res)=>{
    try{
        const notifications = await Notification.find({receiverId: req.params.receiverId});
        res.status(200).json(notifications);
    }catch(err){
        res.status(500).json(err);
    }
});

//getting number of notification for badge inside notification icon
router.get("/noOfNotifications/:id", async(req, res)=>{
    try{
        const notifications = await Notification.findById("6374b1028931795513d7c592");
        const notificationById = await notifications.noOfNotifications.find((n)=>n.receiverId===req.params.id);
        res.status(200).json(notificationById);
    }catch(err){
        res.status(500).json(err);
    }
});

// increasing the length of noOfNotifications array by 1
router.put("/noOfNotifications/:id", async (req, res) => {
    try{
        const notifications = await Notification.findById("6374b1028931795513d7c592");
        const notificationById = await notifications.noOfNotifications.find((n)=>n.receiverId===req.params.id);

        if(notificationById) {
            await Notification.updateOne({"noOfNotifications.receiverId": req.params.id}, {$push: {"noOfNotifications.$.notifications": ""}});
            res.status(200).json("No of notifications has been updated");
        } else {
            await notifications.updateOne({$push: {noOfNotifications: {receiverId: req.params.id, notifications: [""]}}});
            res.status(200).json("New object of notification pushed");
        }
    }catch(err){
        res.status(500).json(err);
    }
});

// setting the length of noOfNotifications array to zero
router.put("/noOfNotifications/empty/:id", async (req, res) => {
    try{
        await Notification.updateOne({"noOfNotifications.receiverId": req.params.id}, { $set: {"noOfNotifications.$.notifications": []} });
        res.status(200).json("noOfNotifications array empty");
    }catch(err){
        res.status(500).json(err);
    }
});

//delete a notification
router.delete("/:id", async (req, res) => {
    try {
      await Notification.findByIdAndRemove(req.params.id);
      res.status(200).json("notification has been deleted");
    }
    catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;
