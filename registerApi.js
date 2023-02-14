const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser } = require("../db/models/user");

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const checkUser = await getUserByEmail(email);
        if (checkUser) {
          next({
            name: "Error signing up",
            message: "That email is already in use",
          });
        }
        if (password.length < 8) {
          next({ name: "Error signing up", message: "Password is too short" });
        }
        const user = await createUser (email, password)
        if (user) {
            const token = jwt.sign(
              {
                id: user.id,
                email,
              },
              process.env.JWT_SECRET
            );
            res.send({
              user,
              message: "Thank you for signing up!",
              token,
              ok: true,
            });
          }
    } catch ({ name, message }) {
        next({ name, message })
    }
})