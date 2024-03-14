import express from "express";
import { check, body } from "express-validator";
import { addPost, getPosts, getPost, updatePost, deletePost } from "../controllers/feed.js";

export const router = express.Router();

router.get("/posts", getPosts);

router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  addPost
);

router.get("/post/:postId", getPost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete('/post/:postId', deletePost)
