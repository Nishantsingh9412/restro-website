import passport from "passport";
import ShortUniqueId from "short-unique-id";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Auth from "../models/auth.js";
import authDeliv from "../models/authDeliv.js";

export const authenticateUser = async (req, res) => {
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  });
};

export const authFailed = async (req, res) => {
  return res
    .status(401)
    .json({ success: false, message: "User Authentication Failed" });
};

export const authSuccess = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "User Authenticated",
      user: req.user,
    });
  } else {
    res.status(403).json({ success: false, message: "User not authenticated" });
  }
  return res.status(200).json({ message: "User Authentication Success" });
};

export const logoutUser = async (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
};

// export const signupGoogle = async (req,res) => {

// }

// export const LoginGoogle = async (req,res) => {

// }

// export const signupController = async(req,res) => {
//     return res.status(200).json({message:"Signup Successfull"})
// }

// export const loginController = async(req,res) => {
//     return res.status(200).json({message:"Login Successfull"})
// }

export const signupController = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const profile_picture = req.file ? req.file.filename : undefined;
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists" });
    }
    if (!name || !email || !password || !confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Please fill all the fields" });
    }
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password does not match" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const uid = new ShortUniqueId({ length: 10 });
    const uniqueId = uid.rnd();
    const newUser = await Auth.create({
      name,
      email,
      password: hashedPassword,
      profile_picture: profile_picture,
      uniqueId: uniqueId,
    });
    if (!newUser) {
      return res
        .status(401)
        .json({ success: false, message: "User not created" });
    } else {
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      return res.status(201).json({ success: true, result: newUser, token });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong", error: error });
  }
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(401)
      .json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const existingUser = await Auth.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Please Create Account" });
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid Credentials" });
      } else {
        const token = jwt.sign(
          { email: existingUser.email, id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res
          .status(200)
          .json({ success: true, result: existingUser, token });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: " Something went wrong " });
  }
};

export const delivBoyLoginController = async (req, res) => {
  const { country_code, phone_number, membership_id } = req.body;
  if (!country_code || !phone_number || !membership_id) {
    return res
      .status(401)
      .json({ success: false, message: "Please fill all the fields" });
  }
  const phone = "+" + country_code + phone_number;
  try {
    const existingUser = await authDeliv
      .findOne({ country_code, phone })
      .populate("created_by");

    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "Please Create Account" });
    } else {
      if (existingUser && existingUser.created_by.uniqueId === membership_id) {
        const token = jwt.sign(
          { phone_number: existingUser.phone_number, id: existingUser._id },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        return res
          .status(200)
          .json({ success: true, result: existingUser, token });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Invalid credentials" });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: " Something went wrong " });
  }
};
