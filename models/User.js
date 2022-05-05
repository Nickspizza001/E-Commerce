const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId



const userSchema = new mongoose.Schema({
  _id:{
    type: String,
    default: function(){
      return new objectId().toString()
    }
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
      type: Boolean,
      default: false
      
  }
}, {timestamps: true});



module.exports = mongoose.model("User", userSchema)