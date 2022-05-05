const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//register

router.post("/", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const result = await newUser.save();
    const { password, ...others } = result._doc;
    res.status(201).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
});

//LOGIN
router.get("/", async (req, res) => {
  try {
    const username = req.body.username || req.body.email;
    const result = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (result) {
      const check = await bcrypt.compare(req.body.password, result.password);

      if (check) {
        const accessToken = jwt.sign(
          {
            id: result._id,
            isAdmin: result.isAdmin,
          },
          process.env.SEC_KEY,
          { expiresIn: "3d" }
        );
        const { password, ...others } = result._doc;

        res.status(207).send({...others, accessToken});
      } else {
        res.status(501).send("wrong password");
      }
    }
  } catch (error) {
    res.status(405).json(error);
  }
});

module.exports = router;
