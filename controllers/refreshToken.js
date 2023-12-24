import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const {
          _id: userId,
          firstName,
          lastName,
          userName,
          email,
          isAdmin,
          isAccountVerified,
          profile_photo: photo,
        } = user;
        const accessToken = jwt.sign(
          {
            userId,
            firstName,
            lastName,
            userName,
            email,
            isAdmin,
            isAccountVerified,
            photo,
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    res.json(error);
  }
});
