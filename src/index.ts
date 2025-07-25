import express, { Application } from "express";
const cors = require("cors");
const routes = require("./routes/index");
const mongoose = require("mongoose");

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
  })
  .catch((er) => {
    console.log("Mongoose Connection failed Error => ", er);
  });




app.use("/api", routes);

export default app;