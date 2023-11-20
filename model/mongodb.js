const mongoose = require("mongoose");
mongoose
  .connect("mongodb://127.0.0.1:27017/logindb")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("error something went wrong");
    console.log(err);
  });

const LoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  first: {
    type: String,
    required: true,
  },
  last: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const collection = mongoose.model("logincollection", LoginSchema);
module.exports = collection;
