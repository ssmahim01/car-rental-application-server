require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Car rental server is running...");
});

app.listen(port, () => {
  console.log(`The Car rental server is running on Port: ${port}`);
});