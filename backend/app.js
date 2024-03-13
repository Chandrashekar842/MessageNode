import { fileURLToPath } from "url";
import path from 'path'

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

import { router } from "./routes/feed.js";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4())
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    return cb(null, true)
  }else {
    return cb(null, false)
  }
}

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'))

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
