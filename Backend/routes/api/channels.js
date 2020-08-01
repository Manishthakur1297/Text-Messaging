const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Channel = require("../../models/Channel");

const {
  addChannel,
  listChannels,
  getChannelById,
  deleteChannel,
  updateChannel,
  inviteMembers,
  createPost,
} = require("../../controllers/channelControllers");

// @route       POST api/channels
// @desc        ADD NEW CHANNEL
// @access      Private
router.post(
  "/",
  [auth, check("name", "Channel Name is Required").not().isEmpty()],
  addChannel
);

// @route       GET api/Channels
// @desc        GET ALL Channels
// @access      Private
router.get("/", auth, listChannels);

// @route       GET api/channels/:id
// @desc        GET Channel By ID
// @access      Private
router.get("/:id", auth, getChannelById);

// @route       DELETE api/channels/:id
// @desc        Delete Channel By ID
// @access      Private
router.delete("/:id", auth, deleteChannel);

// @route       PUT api/Channels
// @desc        Update Channel
// @access      Private

router.put(
  "/:id",
  [auth, check("name", "Channel Name is Required").not().isEmpty()],
  updateChannel
);

// @route       PUT api/channels/:id/invite
// @desc        ADD NEW MEMBERS
// @access      Private
router.put("/:id/invite", auth, inviteMembers);

//--------------------POSTS-------------------------

// @route       POST api/channels/:id/posts
// @desc        ADD NEW POST
// @access      Private
router.post(
  "/:id/posts",
  [auth, check("message", "Post Message is Required").not().isEmpty()],
  createPost
);

module.exports = router;
