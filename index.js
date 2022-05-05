const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require('morgan');

const cartRouter = require("./routes/cart");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    dbName: "E-commerce",
  })
  .then(() => {
    console.log("Mongo connected");
  });

const app = express();
app.use(express.json());
app.use(morgan("combined"))
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening at Port ${process.env.PORT}`);
});
