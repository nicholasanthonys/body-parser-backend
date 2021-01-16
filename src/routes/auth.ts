import{Router} from 'express';

const RefreshToken = require("../model/RefreshToken");
import { Request, Response } from 'express';
import { User, IUser } from '../model/User';

import bcrypt from 'bcrypt';
import { registerValidation, loginValidation } from '../validation/validation';

import jwt from 'jsonwebtoken';


function generateAccessToken(name: String, email: String, id: String): String {
  return jwt.sign(
    // payload data
    { name, email, id },
    `${process.env.ACCESS_TOKEN_SECRET}`,
    { expiresIn: "7d" }
  );
}

const router = Router();
// Register route
router.post("/register", async (req: Request, res: Response) => {
  // validate request body
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if email already exists, throw error if email already exist
  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password, // Hashed password
  });
  try {
    const savedUser = await user.save();
    res.json({ data: { userId: savedUser._id } });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// login route
router.post("/login", async (req: Request, res: Response) => {
  // validate the user
  const { error } = loginValidation(req.body);
  // throw validation errors
  if (error) return res.status(400).json({ error: error.details[0].message });
  const user: IUser | null = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "Password is wrong" });


  // create token
  const token: String = generateAccessToken(user.name, user.email, user._id);

  const refreshToken = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user._id,
    },
    `${process.env.REFRESH_TOKEN_SECRET}`
  );


  const newRefreshToken = new RefreshToken({
    refreshToken,
  });
  try {
    const savedNewRefreshToken = await newRefreshToken.save();
  } catch (error) {
    return res.status(400).json({ msg: "failed to save refreshToken" });
  }

  const response = { token, refreshToken };

  return res.status(200).json(response);
});

// To generate new token
router.post("/token", async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);

  // Get refresh Token
  let savedRefreshToken = await RefreshToken.findOne({ refreshToken: refreshToken })
  if (savedRefreshToken == null) return res.sendStatus(403);

  try {
    const decoded = await jwt.verify(savedRefreshToken.refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`);
    // console.log("verified is");
    // console.log(verified);
    // cast to InterfaceUser
    let user = (decoded as IUser);
    const token: String = generateAccessToken(user.name,user.email,user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(403).json({ error: "Token is not valid" });
  }
});

export default router
