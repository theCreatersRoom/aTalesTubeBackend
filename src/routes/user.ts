import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { uploadImages } from "../utils/helper";
import { verifyToken } from "../middleware/auth";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.post(
  "/register",
  upload.single("profilePicture"),
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("password", "Password must be of minimum 6 length").isLength({
      min: 6,
    }),
    check("name", "Name is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array() });

    const { username, email, password, name, mobile } = req.body;
    const profile = req.file as Express.Multer.File;

    try {
      const user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const imageUrls = await uploadImages([profile]);
      const profilePicture = imageUrls[0];
      const newUser = new User({
        username,
        email,
        passwordHash,
        name,
        mobile,
        profilePicture: profilePicture || null,
      });

      const savedUser = await newUser.save();

      const token = jwt.sign(
        { userId: savedUser._id },
        process.env.JWT_SECRET_KEY as string
      );
      res.status(200).json({ token });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          username: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ users, page, pages: Math.ceil(count / pageSize) });
  } catch (err) {
    console.log("🚀 ~ err:", err);
  }
});

router.post(
  "/updateUser",
  verifyToken,
  upload.single("profilePicture"),
  [
    check("id", "Invalid id").isMongoId(),
    check("name", "Invalid name").isLength({ min: 3, max: 20 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = req.body.name;
      if (req.file) {
        const imageUrl = await uploadImages([req.file]);
        user.profilePicture = imageUrl[0];
      }
      user.save();
      res.json({ ...user.toJSON(), passwordHash: undefined });
    } catch (err) {
      console.log("🚀 ~ err:", err);
    }
  }
);

export default router;
