const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const auth = require("../../middleware/auth");

const {
  userProfile,
  listUsers,
  getUserById,
  deleteUser,
  topUsers,
} = require("../../controllers/userControllers");

// @route       GET api/users
// @desc        User Profile
// @access      Private
router.get("/me", auth, userProfile);

// @route       GET api/users
// @desc        GET ALL Users
// @access      Private
router.get("/", auth, listUsers);

// @route       GET api/users
// @desc        User Profile
// @access      Private
router.get("/top5", auth, topUsers);

// @route       GET api/users/:id
// @desc        GET USER By ID
// @access      Private
router.get("/:id", auth, getUserById);

// @route       DELETE api/users/:id
// @desc        Delete User By ID(Admin All, Individual One)
// @access      Private
router.delete("/:id", auth, deleteUser);

module.exports = router;
