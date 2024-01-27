import { Router } from "express";
import { db } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = Router();

// 🐨 Todo: Exercise #1
// ให้สร้าง API เพื่อเอาไว้ Register ตัว User แล้วเก็บข้อมูลไว้ใน Database ตามตารางที่ออกแบบไว้
authRouter.post("/register", async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  //ให้เข้ารหัส Password ของ User ก่อนที่จะ Save ลง Database ด้วย Package bcrypt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const collection = db.collection("users");
  await collection.insertOne(user);
  return res.json({ message: "User has been created successfully" });
});

// 🐨 Todo: Exercise #3
// ให้สร้าง API เพื่อเอาไว้ Login ตัว User ตามตารางที่ออกแบบไว้

authRouter.post("/login", async (req, res) => {
  //ตรวจสอบ Credentials
  const user = await db
    .collection("users")
    .findOne({ username: req.body.username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  //สร้าง Conditional Logic ตรวจสอบว่า Password ใน Database กับ Password ที่ Client ส่งมาตรงกันหรือไม่จะต้องใช้ Function bcrypt.compare
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    return res.status(401).json({ message: "Password not valid" });
  }

  //Username และ Password ถูกต้อง ใช้ Function jwt.sign เพื่อสร้าง Token
  //1----{ id: user._id, firstName: user.firstName, lastName: user.lastName }
  //2---- secret key
  //3---- Obtion object (expired time)
  const token = jwt.sign(
    { id: user._id, firstName: user.firstName, lastName: user.lastName },
    process.env.SECRET_KEY,
    { expiresIn: "9000" }
  );

  return res.json({ message: "login successfully", token: token });
});

export default authRouter;
