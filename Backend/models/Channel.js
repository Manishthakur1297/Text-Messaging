const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    tags: {
      type: Array,
      default: [],
    },
    members: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = Channel = mongoose.model("channel", ChannelSchema);
