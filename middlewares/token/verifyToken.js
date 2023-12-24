import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token)
      return res.json("Sie mussen sich zuerst in Ihr Konto einloggen");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.json("Der Token ist abgelaufen");
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    res.json(error);
  }
};
