const { validationResult } = require("express-validator");

// @route       GET api/users
// @desc        User Profile
// @access      Private
exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server Error!!!");
  }
};

// @route       GET api/users
// @desc        GET ALL Users
// @access      Private
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/users/:id
// @desc        GET USER By ID
// @access      Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User Not Found!!!" });
    }

    return res.json(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "User Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       DELETE api/users/:id
// @desc        Delete User By ID(Admin All, Individual One)
// @access      Private
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    //Check Valid User

    if (!user) {
      return res.status(404).json({ msg: "User Not Found!!!" });
    }

    if (req.params.id === req.user.id) {
      await user.remove();
      return res.json({ msg: "User Deleted Successfully!!!" });
    }

    return res.status(404).json({ msg: "User Not Authorised!!!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Meal Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/Posts
// @desc        GET ALL Posts
// @access      Private

exports.topUsers = async (req, res) => {
  try {
    let date1 = new Date(Date.parse("1970-01-01T00:00:00.000Z"));
    let date2 = new Date(Date.now());

    let dateQuery = { createdAt: { $gte: date1, $lte: date2 } };

    let d1 = req.query.date1;
    let d2 = req.query.date2;

    if (d1 && d2) {
      let dateQ = {};

      let date1 = new Date(Date.parse(d1 + "T00:00:00.000Z"));
      let date2 = new Date(Date.parse(d2 + "T23:59:59.000Z"));

      dateQ["$gte"] = date1;
      dateQ["$lte"] = date2;
      dateQuery["createdAt"] = dateQ;
    }

    //Top 5 users which have the most number of posts.

    const posts = await Post.aggregate([
      {
        $match: {
          createdAt: dateQuery["createdAt"],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "users",
        },
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$user",
          username: { $first: "$users.username" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, username: "$username", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    //Top 5 trending channels that have the most number of posts along with the number of posts per channel

    const channels = await Post.aggregate([
      {
        $match: {
          createdAt: dateQuery["createdAt"],
        },
      },
      {
        $lookup: {
          from: "channels",
          localField: "channel",
          foreignField: "_id",
          as: "channels",
        },
      },
      { $unwind: { path: "$channels", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$channel",
          name: { $first: "$channels.name" },
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, name: "$name", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    //Top 5 trending tags which are tagged on the most number of channels.

    const tags = await Channel.aggregate([
      {
        $match: {
          createdAt: dateQuery["createdAt"],
        },
      },
      { $project: { _id: 0, tags: 1 } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $project: { _id: 0, tags: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    //Top 5 trending regions which have the most number of active users.

    const regions = await User.aggregate([
      {
        $match: {
          createdAt: dateQuery["createdAt"],
        },
      },
      { $project: { _id: 0, region: 1 } },
      { $group: { _id: "$region", count: { $sum: 1 } } },
      { $project: { _id: 0, region: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    return res.json({
      posts,
      channels,
      tags,
      regions,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};
