const router = require("express").Router();
// const mongoose = require("mongoose");
// const objectId = mongoose.Types.ObjectId


const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    hashPassword = await bcrypt.hash(req.body.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(202).json(updatedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});
// get a particular user....only admin can do that
router.get("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const result = await User.findById(req.params.id);

    const { password, ...others } = result._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/s", verifyTokenAndAdmin, async (req, res) => {
  const result = await User.find()
  if (result) {
    let newArray = [];
    //the password should not be sent or displayed
    for (let index = 0; index < result.length; index++) {
      const { password, ...others } = result[index]._doc;
      newArray.push(others);
    }

    res.status(200).json(newArray);
  } else {
    res.status(500).json("Error in getting all users");
  }
});


//hello guys this is where the problem is, i cant access the router with this endpoint except i use "/" endpoint
router.get("/", async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear() - 1);

  try {
    const data = await User.aggregate([
     { $match: { createdAt: { $gte: lastYear } } }, //only documents that pass this test can go to the next stage i.e only documents with year greater than last year (literally all documents for now)

      {
        $project: {
          month: { $month: "$createdAt" },
          year: {$year: "$createdAt"},
        },
      },
      {
        $group: {
          _id: "$month",
          
          total: { $sum: 1},
//sum of all the documents that match this query once       
        },
      },
    ]);
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
