const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const port = 5000;

dotenv.config();
//connect to DB
mongoose.connect(
  process.env.DATABASE_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to MongoDB........");
  }
);
app.listen(port, () => console.log(`Server Running at ${port}......`));
