import express from "express";
import { body } from "express-validator";

import { signUp, login } from "../controllers/auth.js";
import { User } from "../models/user.js";

export const authRouter = express.Router();

authRouter.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a Valid Email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Emial already registered");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  signUp
);

authRouter.post('/login', login)
