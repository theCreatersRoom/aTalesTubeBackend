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
  } catch (err) {
    console.log("🚀 ~ err:", err);
  }
});

router.post(
  "/newStory",
  verifyToken,
  upload.single("coverImage"),
  [
    check("story", "Story is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
    check("categories", "Categories are required").not().isEmpty(),
    check("tags", "Tags are required").not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { story, title, description, author, categories, tags, chapters } =
        req.body;
      let coverImageUrl: string | undefined = undefined;
      if (req.file) {
        const coverImage = req.file as Express.Multer.File;
        const imageUrls = await uploadImages([coverImage]);
        coverImageUrl = imageUrls[0];
      }
      const newStory = new Story({
        story,
        title,
        description,
        author,
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
