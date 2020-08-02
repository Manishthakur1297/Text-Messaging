const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route       POST api/register
// @desc        Register USER
// @access      Public
router.post(
  "/register",
  [
    check("username", "UserName is Required").not().isEmpty(),

    check("email", "Please Enter Valid Email ID").isEmail(),

    check(
      "password",
      "Please Enter a Password with 1 or more cahracters"
    ).isLength({ min: 1 }),

    check("region", "Please Enter your region").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, region } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already exists!" }] });
      }

      user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Username already exists!" }] });
      }

      user = new User({
        username,
        email,
        password,
        region,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token });
        }
      );
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  }
);

// @route       POST api/login
// @desc        Login User
// @access      Public
router.post(
  "/login",
  [
    check("username", "Please Enter Valid Username").not().isEmpty(),

    check(
      "password",
      "Please Enter a Password with 1 or more cahracters"
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    console.log(req.body);
    try {
      let user = await User.findOne({ username });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token, id: user.id });
        }
      );
    } catch (error) {
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
