import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

//REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, userName, password } = req.body;
  const userExists = await User.findOne({ $or: [{ userName }, { email }] });
  if (userExists) {
    if (userExists.email === email)
      throw new Error(
        "Ein benutzer mit dieser Email Address ist bereit registeriert"
      );
    if (userExists.userName === userName)
      throw new Error(
        "Ein benutzer mit dieser Username ist bereit registeriert"
      );
  } else {
    try {
      await User.create({ firstName, lastName, email, userName, password });
      res.json("Sie haben sich erfolgreich registeriert");
    } catch (error) {
      res.json(error);
    }
  }
});

//LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const loginType = userName ? "Username" : email ? "Email" : null;
  const userFound = await User.findOne({ $or: [{ email }, { userName }] });
  if (userFound && (await userFound.isPasswordMatched(password))) {
    const {
      _id: userId,
      firstName,
      lastName,
      userName,
      email,
      isAdmin,
      isAccountVerified,
      profile_photo: photo,
    } = userFound;
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
    const refreshToken = jwt.sign(
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
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await User.findByIdAndUpdate(userId, { refresh_token: refreshToken });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.status(401);
    throw new Error(`${loginType} or Password ist nicht Korrekt`);
  }
});

//LOGOUT
export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.json("keine Token gefunden");
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) return res.json("keine user gefunden");
    user.refresh_token = undefined;
    await user.save();
    res.clearCookie("refreshToken");
    res.json("logout successfull");
  } catch (error) {
    res.json(error);
  }
});

// GET ALL USER
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

// Get LoggedIn User
export const getLoggedInUser = asyncHandler(async (req, res) => {
  const id = req.userId;
  const user = await User.findById(id);
  if (user) {
    res.json(user);
  } else {
    throw new Error("Gastbenutzer");
  }
});
