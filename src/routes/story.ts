import express, { Request, Response } from "express";
import User from "../models/user";
import Story from "../models/story";
import { verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import multer from "multer";
import { uploadImages } from "../utils/helper";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    if (id) {
      const story = await Story.findById(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      return res.json({ story });
    } else {
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
      const count = await Story.countDocuments({ ...keyword });
      const stories = await Story.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      res.json({ data: stories, page, pages: Math.ceil(count / pageSize) });
    }
  } catch (err) {
    console.log("🚀 ~ err:", err);
  }
});

router.get(
  "/getStorysByUser",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "User id is required" });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const pageSize = 10;
      const page = Number(req.query.pageNumber) || 1;
      const count = await Story.countDocuments({ author: userId });
      const stories = await Story.find({ author: userId })
        .limit(pageSize)
        .skip(pageSize * (page - 1));
      res.json({ data: stories, page, pages: Math.ceil(count / pageSize) });
    } catch (err) {
      console.log("🚀 ~ err:", err);
    }
  }
);

router.post(
  "/newStory",
  verifyToken,
  upload.single("coverImage"),
  [
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, author, categories, tags, chapters } =
        req.body;
      let coverImageUrl: string | undefined = undefined;
      if (req.file) {
        const coverImage = req.file as Express.Multer.File;
        const imageUrls = await uploadImages([coverImage]);
        coverImageUrl = imageUrls[0];
      }
      const user = await User.findById(author);

      if (!user) {
        return res.status(404).json({ message: "Something went wrong" });
      }
      const newStory = new Story({
        title,
        description,
        author,
        authorName: user.username,
        categories,
        tags,
        chapters,
        coverImage: coverImageUrl || "",
      });
      const savedStory = await newStory.save();
      res.json(savedStory);
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/deleteStory",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const { storyId } = req.query;
      if (!storyId) {
        return res.status(400).json({ message: "Story id is required" });
      }

      const deletedStory = await Story.findByIdAndDelete(storyId);
      if (!deletedStory) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json({ message: "Story deleted successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
