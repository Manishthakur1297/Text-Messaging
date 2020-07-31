const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "channel",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = Post = mongoose.model("post", PostSchema);
