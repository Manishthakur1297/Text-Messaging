const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
const Post = require("../../models/Post");

const {
  listPosts,
  getPostById,
  deletePost,
  updatePost,
} = require("../../controllers/postControllers");

// @route       GET api/Posts
// @desc        GET ALL Posts
// @access      Private
router.get("/", auth, listPosts);

// @route       GET api/posts/:id
// @desc        GET Post By ID
// @access      Private
router.get("/:id", auth, getPostById);

// @route       DELETE api/posts/:id
// @desc        Delete Post By ID
// @access      Private
router.delete("/:id", auth, deletePost);

// @route       PUT api/Posts
// @desc        Update Post
// @access      Private

router.put(
  "/:id",
  [auth, check("message", "Post Name is Required").not().isEmpty()],
  updatePost
);

module.exports = router;
