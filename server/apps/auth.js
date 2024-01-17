import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../utils/db.js";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/auth/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("user");
  await collection.insertOne(user);

  return res.json({
    message: "User has been created successfully",
  });
});

authRouter.post("/auth/login", async (req, res) => {
  const user = await db.collection("user").findOne({
    username: req.body.username,
  });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    return res.status(401).json({
      message: "password not valid",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "900000",
    }
  );

  return res.json({
    message: "login successfully",
    token: token,
  });
});

export default authRouter;
