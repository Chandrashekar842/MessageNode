import express from "express";
import bodyParser from "body-parser";
import { router } from "./routes/feed.js";
import mongoose from "mongoose";
import path from 'path'
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", router);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode
    const message = error.message
    res.status(status).json({
        message: message
    })
})

mongoose
  .connect(
    "mongodb+srv://cs1762236:qEQnzfEvRooHOC3X@cluster0.dhck1xd.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(4000, () => {
      console.log("listening on port 4000");
    });
  })
  .catch((err) => console.log(err));
