import express from "express";
import User from "../models/user";
import Story from "../models/story";
import UserProgress from "../models/userProgress";
import Choice from "../models/choice";
import Chapter from "../models/chapter";
import { verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const { chapterId } = req.query;

    if (!chapterId) {
      return res.status(400).json({ message: "Chapter id is required" });
    }
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }
    res.json(chapter);
  } catch (err) {
    console.log("🚀 ~ err:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// This will create new chapter to specific story and push chapter in story array
router.post(
  "/newChapter",
  verifyToken,
  upload.single("media"),
  [
    check("storyId", "Story id is required").not().isEmpty(),
    check("title", "Title is required").not().isEmpty(),
    check("content", "Content is required").not().isEmpty(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { storyId, title, content } = req.body;
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      const newChapter = new Chapter({
        storyId,
        title,
        content,
      });

      story.chapters.push({
        chapterId: newChapter.id,
        title,
        description: title,
        order: story.chapters.length + 1,
      });
      story.save();
      const savedChapter = await newChapter.save();
      res.json(savedChapter);
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// this will delete chapter from story
router.delete(
  "/deleteChapter",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { chapterId } = req.query;
      const chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      const story = await Story.findById(chapter.storyId);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      const deletedChapter = await Chapter.findByIdAndDelete(chapterId);
      if (!deletedChapter) {
        return res.status(404).json({ message: "Chapter not found" });
      }
      story.chapters = story.chapters.filter(
        (chapter) => chapter.chapterId !== chapterId
      );
      await story.save();
      res.json({ message: "Chapter deleted successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
