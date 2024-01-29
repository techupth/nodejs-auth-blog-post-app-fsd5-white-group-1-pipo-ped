import jwt from "jsonwebtoken";

// 🐨 Todo: Exercise #5
// สร้าง Middleware ขึ้นมา 1 อันชื่อ Function ว่า `protect`
// เพื่อเอาไว้ตรวจสอบว่า Client แนบ Token มาใน Header ของ Request หรือไม่

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  //ถ้า Client ไม่ได้แนบ Token มา
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please send me a JWT token",
    });
  }

  //ตรวจสอบ token ถูกต้อง/หมดอาย ? Verify ตัว Token แล้วมี Error
  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "JWT token is invalid",
      });
    }
    req.user = payload;
    next();
  });
};
