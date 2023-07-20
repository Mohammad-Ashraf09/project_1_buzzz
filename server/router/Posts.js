const router = require("express").Router();
const Post = require("../model/Post");
const User = require("../model/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // if (post.userId === req.body.userId) {
    //   await post.deleteOne();
    //   res.status(200).json("the post has been deleted");
    // } else {
    //   res.status(403).json("you can delete only your post");
    // }
    await post.deleteOne();
    res.status(200).json("the post has been deleted");
  }
  catch (err) {
    res.status(500).json(err);
  }
});

//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });   // toggle
      res.status(200).json("like removed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//dislike a post
router.put("/:id/dislike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislikes.includes(req.body.userId)) {
      await post.updateOne({ $push: { dislikes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    } else {
      await post.updateOne({ $pull: { dislikes: req.body.userId } });   // toggle
      res.status(200).json("dislike removed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId.id });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    res.status(500).json(err);
  }
});

//get particular user posts
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: user._id });
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//add comment
router.put("/:id/comment", async(req, res)=>{
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({ $push: { comments: req.body } });
    res.status(200).json("Comment added...");
  }
  catch (err) {
    res.status(500).json(err);
  }
});

//get particular comment
router.get("/:id/comment/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.find((cmnt)=>cmnt.commentId===req.params.commentId);
    
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//like comment
router.put("/:id/comment/:commentId/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.find((cmnt)=>cmnt.commentId===req.params.commentId);
    if (!comment.commentLikes.includes(req.body.userId)) {
      await Post.updateOne({"comments.commentId": req.params.commentId}, {$push: {"comments.$.commentLikes": req.body.userId}});
      res.status(200).json("The comment has been liked");
    } else {
      await Post.updateOne({"comments.commentId": req.params.commentId}, {$pull: {"comments.$.commentLikes": req.body.userId}});   // toggle
      res.status(200).json("like removed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//add nested comment (reply)
router.put("/:id/comment/:commentId/reply", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    await Post.updateOne({"comments.commentId": req.params.commentId}, {$push: {"comments.$.nestedComments": req.body}});
    res.status(200).json("nested comment added");

  } catch (err) {
    res.status(500).json(err);
  }
});

//edit comment
router.put("/:id/comment/:commentId/edit", async (req, res) => {
  try {
    await Post.updateOne({"comments.commentId": req.params.commentId}, {$set: {"comments.$.comment": req.body.updatedComment}});
    res.status(200).json("Comment updated");
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete comment
router.put("/:id/comment/:commentId", async(req, res)=>{
  try {
    const post = await Post.findById(req.params.id);
    await post.updateOne({$pull: {comments: {commentId: req.params.commentId }}});
    res.status(200).json("Comment deleted...");
  }
  catch (err) {
    res.status(500).json(err);
  }
});


//get particular nested comment
router.get("/:id/comment/:commentId/reply/:nestedCommentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.find((cmnt)=>cmnt.commentId===req.params.commentId);
    const nestedComment = await comment.nestedComments.find((cmnt)=>cmnt.nestedCommentId===req.params.nestedCommentId);
    
    res.status(200).json(nestedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//like nested comment--------------> working fine
router.put("/:id/comment/:commentId/like/:nestedCommentId/nestedLike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.find((cmnt)=>cmnt.commentId===req.params.commentId);
    const nestedComment = await comment.nestedComments.find((cmnt)=>cmnt.nestedCommentId===req.params.nestedCommentId);

    if (!nestedComment.nestedCommentLikes.includes(req.body.userId)) {
      await Post.findOneAndUpdate(
        {"comments.nestedComments.nestedCommentId": req.params.nestedCommentId},
        {$push: {"comments.$[outer].nestedComments.$[inner].nestedCommentLikes": req.body.userId}},
        {arrayFilters: [{ "outer.commentId": req.params.commentId }, { "inner.nestedCommentId": req.params.nestedCommentId }]}
      );
      res.status(200).json("nested comment has been liked");
    } else {
      await Post.findOneAndUpdate(
        {"comments.nestedComments.nestedCommentId": req.params.nestedCommentId},
        {$pull: {"comments.$[outer].nestedComments.$[inner].nestedCommentLikes": req.body.userId}},
        {arrayFilters: [{ "outer.commentId": req.params.commentId }, { "inner.nestedCommentId": req.params.nestedCommentId }]}
      );  // toggle
      res.status(200).json("nested like removed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete nested comment
router.put("/:id/comment/:commentId/removeNestedComment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.comments.find((cmnt)=>cmnt.commentId===req.params.commentId);
    const nestedComment = await comment.nestedComments.find((cmnt)=>cmnt.nestedCommentId===req.body.nestedCommentId);

    await Post.findOneAndUpdate(
      {"comments.nestedComments.nestedCommentId": req.body.nestedCommentId},
      {$pull: {"comments.$[outer].nestedComments": {nestedCommentId: req.body.nestedCommentId}}},
      {arrayFilters: [{ "outer.commentId": req.params.commentId }]}
    );
    res.status(200).json("nested comment removed");
    
  } catch (err) {
    res.status(500).json(err);
  }
});

// if(receiver){  // agar main user ke andar wo present hai jisko notification bhejna hai
//   await Message.findOneAndUpdate(
//       {"noOfNotifications.userId": req.body.user2},
//       {$push: {"noOfNotifications.$.receiverId.$[xxx].notifications": ""}},
//       {arrayFilters: [{"xxx.id": req.body.user1}]},
//   );
//   res.status(200).json("notifications array increased by 1");
// }

module.exports = router;
