const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI;

const mongodbConnect = () => {
  mongoose
    .connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    .then(() => console.log("Successfully connected to Database"))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};
module.exports = mongodbConnect;
