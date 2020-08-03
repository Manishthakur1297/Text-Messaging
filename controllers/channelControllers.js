const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

// @route       POST api/channels
// @desc        ADD NEW CHANNEL
// @access      Private
exports.addChannel = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
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
};

// @route       GET api/Channels
// @desc        GET ALL Channels
// @access      Private
exports.listChannels = async (req, res) => {
  try {
    const channels = await Channel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          user: 1,
          members: 1,
        },
      },
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ["$user", mongoose.Types.ObjectId(req.user.id)] },
              { $in: [mongoose.Types.ObjectId(req.user.id), "$members"] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "channel",
          as: "posts",
        },
      },
      { $unwind: { path: "$posts", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$name",
          channelId: { $first: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },

      //   { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    return res.json(channels);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/channels/:id
// @desc        GET Channel By ID
// @access      Private
exports.getChannelById = async (req, res) => {
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
};

// @route       DELETE api/channels/:id
// @desc        Delete Channel By ID
// @access      Private
exports.deleteChannel = async (req, res) => {
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
};

// @route       PUT api/Channels
// @desc        Update Channel
// @access      Private

exports.updateChannel = async (req, res) => {
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
};

// @route       PUT api/channels/:id/invite
// @desc        ADD NEW MEMBERS
// @access      Private
exports.inviteMembers = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      console.log("Channel Not Found");
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    //   const user = await User.findById(req.user.id).select("-password");

    const { members } = req.body;

    const channelFields = {};

    let newMembers = [...channel.members].map((m) => m.toString());

    // console.log(newMembers);

    for (i = 0; i < members.length; i++) {
      const currentId = newMembers.indexOf(members[i]);
      if (currentId == -1) {
        newMembers.push(members[i]);
      }
    }

    if (members) channelFields.members = newMembers;
    // if (req.user.id !== channel.user._id.toString()) {
    //   console.log("User not Authorised");
    //   return res.status(404).json({ msg: "User Not Authorised!!!" });
    // }

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
};

//--------------------POSTS-------------------------

// @route       POST api/channels/:id/posts
// @desc        ADD NEW POST
// @access      Private
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    const newPost = new Post({
      message: req.body.message,
      channel: req.params.id,
      user: req.user.id,
    });

    const post = await newPost.save();

    return res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/channels/:id/posts
// @desc        GET ALL POSTS
// @access      Private
exports.getPosts = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }

    const posts = await Post.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$channel", mongoose.Types.ObjectId(req.params.id)],
          },
        },
      },
      { $sort: { createdAt: 1 } },
    ]);
    return res.json({ posts });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Channel Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/Channels
// @desc        GET ALL Channels
// @access      Private
exports.dashboard = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $group: {
          _id: "$channel",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 1,
          name: 1,
          user: 1,
          members: 1,
        },
      },
      {
        $match: {
          $expr: {
            $or: [
              { $eq: ["$user", mongoose.Types.ObjectId(req.user.id)] },
              { $in: [mongoose.Types.ObjectId(req.user.id), "$members"] },
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "channel",
          as: "posts",
        },
      },
      { $unwind: { path: "$posts", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$name",
          channel: { $first: "$_id" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },

      //   { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    return res.json(channels);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};
