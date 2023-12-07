const mongoose = require("mongoose");
require('dotenv').config()
const mongoUrl = process.env.MONGO_URL;

const connectToMongo = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoUrl);
    console.log("db connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
module.exports = connectToMongo;