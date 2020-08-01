const { validationResult } = require("express-validator");

// @route       GET api/Posts
// @desc        GET ALL Posts
// @access      Private
exports.listPosts = async (req, res) => {
  try {
    // let query = req.body[0];
    const posts = await Post.find().sort({ createdAt: -1 });
    // const posts = await Post.aggregate([
    //   { $group: { _id: "$channel", count: { $sum: 1 } } },
    //   { $sort: { count: -1 } },
    // ]);
    return res.json({ posts });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       GET api/posts/:id
// @desc        GET Post By ID
// @access      Private
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check Valid User

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }

    return res.json(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       DELETE api/posts/:id
// @desc        Delete Post By ID
// @access      Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check Valid User

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(404).json({ msg: "User Not Authorised!!!" });
    }

    await post.remove();

    return res.json({ msg: "Post Removed!!!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};

// @route       PUT api/Posts
// @desc        Update Post
// @access      Private

exports.updatePost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!!!" });
    }

    //   const user = await User.findById(req.user.id).select("-password");

    const { message } = req.body;

    const postFields = {};

    if (message) postFields.message = message;

    if (req.user.id !== post.user.toString()) {
      return res.status(404).json({ msg: "User Not Authorised!!!" });
    }

    const updatePost = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: postFields },
      { new: true }
    );

    return res.json(updatePost);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
};
