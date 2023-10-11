import express, { Application } from "express";
const cors = require("cors");
const routes = require("./src/routes/index");
const mongoose = require("mongoose");
require("dotenv").config();

const app: Application = express();

app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.use(cors());


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Database");
    app.listen(port, () => {
      console.log("Listening on port " + port);
  });
  })
  .catch((er) => {
    console.log("Mongoose Connection failed Error => ", er);
  });

const port = process.env.PORT || 8080;



app.use("/api", routes);

export default app;
