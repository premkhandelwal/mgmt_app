import express, { Application } from "express";
import cors from "cors";
import routes from "./routes/index";
import mongoose from "mongoose";

const app: Application = express();

app.use(express.urlencoded({ extended: true }))

app.use(express.json());

app.use(cors());


mongoose
  .connect(process.env.MONGO_URL, {
  })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((er) => {
    console.log("Mongoose Connection failed Error => ", er);
  });




app.use("/api", routes);

export default app;