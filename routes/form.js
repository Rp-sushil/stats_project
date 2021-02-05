const express = require("express");
const router = express.Router();
const Form = require("../models/Form");
const Joi = require("joi");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();

const schema = Joi.object().keys({
  firstName: Joi.string().required().min(3).max(255),
  lastName: Joi.string().required().min(2).max(255),
  email: Joi.string().required().min(6).max(255),
  message: Joi.string().required().min(10),
});

router.post("/submit", async (req, res) => {
  //   console.log("Api calls");
  //   console.log(req.body.data);
  const token = req.body.token;
  async function validateHuman(token) {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    return data.success;
  }
  const human = await validateHuman(token);
  if (!human) {
    res.status(400);
    res.json({ errors: "Please, you are not fooling us, bot." });
    return;
  }
  const { error } = schema.validate(req.body.data);
  if (error) return res.status(400).json({ message: error.message });
  const { firstName, lastName, email, message } = req.body.data;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  console.log(date.toDateString("en-GB"));
  const newFormData = new Form({
    firstName,
    lastName,
    email,
    message,
    date,
  });
  try {
    const savedFormData = await newFormData.save();
    return res.status(200).json({ id: savedFormData._id });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
});

router.get("/stats", async (req, res) => {
  if (req.query.startDate) {
    startDate = new Date(req.query.startDate);
    if (isNaN(startDate.getTime())) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
    }
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
  }
  if (req.query.endDate) {
    endDate = new Date(req.query.endDate);
    if (isNaN(endDate.getTime())) {
      endDate = new Date();
    }
  } else {
    endDate = new Date();
  }
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);
  console.log(startDate.toDateString("en-GB"), endDate.toDateString("en-GB"));
  if (!startDate || !endDate)
    return res.status(400).json({ message: "Missing Date Info" });
  try {
    const data = await Form.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: "$date", count: { $sum: 1 } } },
      {
        $project: {
          count: "$count",
          _id: 0,
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$_id" },
          },
        },
      },
    ]).sort({ date: 1 });
    if (!data) return res.status(500).json({ message: "Cannot Find data" });
    // console.log(data);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  //{ date: { $gte: startDate, $lte: endDate } }
});
module.exports = router;
