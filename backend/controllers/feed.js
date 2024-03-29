import fs from "fs";
import path from "path";

import { validationResult } from "express-validator";
import { Post } from "../models/post.js";
import { __dirname } from "../app.js";
import { User } from "../models/user.js";

export const getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({
          message: "Posts fetched",
          posts: posts,
          totalItems: totalItems,
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const addPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, Data entered is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const err = new Error("No Image Provided");
    err.statusCode = 422;
    throw err;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const { title, content } = req.body;
  let creator
  const post = new Post({
    title: title,
    imageUrl: imageUrl,
    content: content,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId)
    })
    .then(user => {
      creator = user
      user.posts.push(post)
      return user.save()
    })
    .then(result => {
      res.status(201).json({
        message: "Post created successfully",
        post: post,
        creator: {
          _id: creator._id,
          name: creator.name
        }
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("could not find the post");
        err.statusCode = 404;
        throw err;
      }
      res.status(200).json({
        message: "Post Fetched!!",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const updatePost = (req, res, next) => {
  const postId = req.params.postId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Validation failed, Data entered is incorrect");
    err.statusCode = 422;
    throw err;
  }

  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No Image Selected");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("Could not find post");
        err.statusCode = 404;
        throw err;
      }
      if(post.creator.toString() !== req.userId) {
        const err = new Error('Not Authorized')
        err.statusCode = 422
        throw err
      }
      if (imageUrl != post.imageUrl) {
        clearImage(post.imagaUrl);
      }
      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;
      return post.save();
    })
    .then((result) => {
      return res.status(200).json({
        message: "Post updated successfully",
        updatedPost: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("No post found to delete");
        err.statusCode = 404;
        throw err;
      }
      if(post.creator.toString() !== req.userId) {
        const err = new Error('Not Authorized')
        err.statusCode = 422
        throw err
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Post Deleted Successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
