const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Channel = require("../../models/Channel");

const formatDate = require("../../utils/format_date");

// @route       POST api/channels
// @desc        ADD NEW CHANNEL
// @access      Private
router.post(
  "/",
  [auth, check("name", "Channel Name is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //   const user = await User.findById(req.user.id).select("-password");

      const newChannel = new Channel({
        name: req.body.name,
        description: req.body.description,
        user: req.user.id,
        tags: req.body.tags,
        members: req.body.members,
      });

      const channel = await newChannel.save();

      return res.json(channel);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error!!");
    }
  }
);

// @route       GET api/Channels
// @desc        GET ALL Channels
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const channels = await Channel.find().sort({ createdAt: -1 });
    return res.json(channels);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

// @route       GET api/channels/:id
// @desc        GET Channel By ID
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    //Check Valid User

    if (!channel) {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (channel.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User Not Authorised!!!" });
    }

    return res.json(channel);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

// @route       DELETE api/channels/:id
// @desc        Delete Channel By ID
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    //Check Valid User

    if (!channel) {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (channel.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User Not Authorised!!!" });
    }

    await channel.remove();

    return res.json({ msg: "Channel Removed!!!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

// @route       PUT api/Channels
// @desc        Update Channel
// @access      Private

router.put(
  "/:id",
  [auth, check("name", "Channel Name is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const channel = await Channel.findById(req.params.id);

      if (!channel) {
        return res.status(404).json({ msg: "Channel Not Found!!!" });
      }

      //   const user = await User.findById(req.user.id).select("-password");

      const { name, description, tags, members } = req.body;

      const channelFields = {};

      if (name) channelFields.name = name;
      if (description) channelFields.description = description;
      if (tags) channelFields.tags = tags;
      if (members) channelFields.members = members;

      if (req.user.id !== channel.user.toString()) {
        return res.status(404).json({ msg: "User Not Authorised!!!" });
      }

      const updateChannel = await Channel.findOneAndUpdate(
        { _id: req.params.id },
        { $set: channelFields },
        { new: true }
      );

      return res.json(updateChannel);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error!!");
    }
  }
);

// @route       PUT api/channels/:id/invite
// @desc        ADD NEW MEMBERS
// @access      Private
router.put("/:id/invite", auth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    //   const user = await User.findById(req.user.id).select("-password");

    const { members } = req.body;

    const channelFields = {};

    if (members) channelFields.members = [channel.members, ...members];

    if (req.user.id !== channel.user.toString()) {
      return res.status(404).json({ msg: "User Not Authorised!!!" });
    }

    const updateChannel = await Channel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: channelFields },
      { new: true }
    );

    return res.json(updateChannel);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

//--------------------POSTS-------------------------

// @route       POST api/channels/:id/posts
// @desc        ADD NEW POST
// @access      Private
router.post(
  "/:id/posts",
  [auth, check("message", "Post Message is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //   const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        message: req.body.message,
        channel: req.params.id,
        user: req.user.id,
      });

      const post = await newPost.save();

      return res.json(post);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Server Error!!");
    }
  }
);

// @route       GET api/Channels
// @desc        GET ALL Channels
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const channels = await Channel.find().sort({ createdAt: -1 });
    return res.json(channels);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

module.exports = router;
