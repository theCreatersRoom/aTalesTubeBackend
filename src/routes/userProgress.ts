import express from "express";
import User from "../models/user";
import UserProgress from "../models/userProgress";
import { verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const { storyId, userId } = req.query;
    const userProgress = await UserProgress.findOne({ storyId, userId });
    if (!userProgress) {
      return res.status(404).json({ message: "User progress not found" });
    }
    res.json({ userProgress });
  } catch (err) {
    console.log("🚀 ~ err:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/newUserProgress",
  verifyToken,
  [
    check("storyId", "Story id is required").not().isEmpty(),
    check("userId", "User id is required").not().isEmpty(),
    check("currentChapterId", "Current chapter id is required").not().isEmpty(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { storyId, userId, currentChapterId, choicesMade } = req.body;
      const newUserProgress = new UserProgress({
        storyId,
        userId,
        currentChapterId,
        choicesMade,
        startedAt: new Date(),
      });
      await newUserProgress.save();
      res.json({ message: "User progress created successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/updateUserProgress",
  verifyToken,
  [
    check("storyId", "Story id is required").not().isEmpty(),
    check("userId", "User id is required").not().isEmpty(),
    check("currentChapterId", "Current chapter id is required").not().isEmpty(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { storyId, userId, currentChapterId, choicesMade } = req.body;
      const userProgress = await UserProgress.findOneAndUpdate(
        { storyId, userId },
        {
          currentChapterId,
          choicesMade,
          updatedAt: new Date(),
        },
        { new: true }
      );
      if (!userProgress) {
        return res.status(404).json({ message: "User progress not found" });
      } else {
        res.json({ message: "User progress updated successfully" });
      }
    } catch (err) {
      console.log("🚀 ~ err:", err);
    }
  }
);

router.delete(
  "/deleteUserProgress",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const { storyId, userId } = req.query;
      const deletedUserProgress = await UserProgress.findOneAndDelete({
        storyId,
        userId,
      });
      if (!deletedUserProgress) {
        return res.status(404).json({ message: "User progress not found" });
      }
      res.json({ message: "User progress deleted successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
