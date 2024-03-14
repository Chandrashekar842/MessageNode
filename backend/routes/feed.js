import express from "express";
import { check, body } from "express-validator";
import { addPost, getPosts, getPost, updatePost, deletePost } from "../controllers/feed.js";
import { verifyToken } from "../middleware/is-auth.js";

export const router = express.Router();

router.get("/posts", verifyToken, getPosts);

router.post(
  "/post",
  verifyToken,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  addPost
);

router.get("/post/:postId", verifyToken, getPost);

router.put(
  "/post/:postId",
  verifyToken,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete('/post/:postId', verifyToken, deletePost)
