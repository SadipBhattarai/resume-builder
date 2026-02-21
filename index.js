const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config();
const indexRouter = require("./routes/index.js");

const PORT = process.env.PORT || 8006;

app.use("/", indexRouter);

app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log(`Database is connected...`);
  })
  .catch((e) => {
    console.log(`Database Error`, e.toString());
  });

app.use((error, req, res, next) => {
  const myErr = error.toString() || `Something went Wrong`;
  res.status(500).json({ data: null, error: myErr });
  next();
});

app.listen(PORT, () => {
  console.log(`Application is running on http://localhost:${PORT}`);
});
