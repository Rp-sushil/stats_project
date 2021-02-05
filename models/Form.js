const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

// var getDate = function () {
//   const date = new Date();
//   console.log(date.toLocaleDateString("en-GB"));
//   return date.toLocaleDateString("en-GB");
// };

const FormSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    max: 255,
    min: 3,
  },
  lastName: {
    type: String,
    required: true,
    max: 255,
    min: 2,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  message: {
    type: String,
    required: true,
    min: 10,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Form = mongoose.model("formData", FormSchema);

module.exports = Form;
