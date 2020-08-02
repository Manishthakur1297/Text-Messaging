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
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
  },
  { timestamps: true }
);

// ChannelSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "user",
//     select: "username",
//   }).populate({
//     path: "members",
//     select: "username",
//   });
//   next();
// });

module.exports = Channel = mongoose.model("channel", ChannelSchema);
