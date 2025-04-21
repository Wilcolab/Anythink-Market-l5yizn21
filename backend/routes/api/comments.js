const router = require("express").Router();
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const messages = require("../../constants/messages");

module.exports = router;

router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "username");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/", async (req, res) => {
  const { text, postId } = req.body;
  const userId = req.user._id;

  if (!text || !postId) {
    return res.status(400).json({ error: "Text and postId are required" });
  }

  try {
    const comment = new Comment({
      text,
      postId,
      user: userId,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
);
router.delete("/:id", async (req, res) => {
    try {
        const { id: commentId } = req.params;

        if (!commentId) {
            return res.status(400).json({ error: "Comment ID is required" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ error: messages.commentNotFound });
        }

        await comment.deleteOne();
        res.status(200).json({ message: messages.commentDeleted });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
