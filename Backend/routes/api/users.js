const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const User = require("../../models/User");
const auth = require("../../middleware/auth");

// @route       GET api/users
// @desc        User Profile
// @access      Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).send("Server Error!!!");
  }
});

// @route       GET api/users
// @desc        GET ALL Users
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error!!");
  }
});

// @route       GET api/users/:id
// @desc        GET USER By ID
// @access      Private
router.get("/:id", auth, async (req, res) => {
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
});

// @route       DELETE api/users/:id
// @desc        Delete User By ID(Admin All, Individual One)
// @access      Private
router.delete("/:id", auth, async (req, res) => {
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
});

module.exports = router;
