import express from "express";
import User from "../models/user";
import Choice from "../models/choice";
import { verifyToken } from "../middleware/auth";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get(
  "/",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    try {
      const { chapterId } = req.query;

      if (!chapterId) {
        return res.status(400).json({ message: "Chapter id is required" });
      }
      const choices = await Choice.find({ chapterId });
      res.json({ choices });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/createChoice",
  verifyToken,
  [
    check("chapterId", "Chapter id is required").not().isEmpty(),
    check("text", "Text is required").not().isEmpty(),
    check("nextChapterId", "Next chapter id is required").not().isEmpty(),
    check("nextChapterId", "Next chapter id must be a string").isString(),
    check("nextChapterId", "Next chapter id must be a chapter id").isMongoId(),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { choice, chapterId, text, nextChapterId } = req.body;
      const newChoice = new Choice({
        chapterId,
        text,
        nextChapterId,
      });
      await newChoice.save();
      res.json({ message: "Choice created successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.delete(
  "/deleteChoice",
  verifyToken,
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { choiceId } = req.query;
      const deletedChoice = await Choice.findByIdAndDelete(choiceId);
      if (!deletedChoice) {
        return res.status(404).json({ message: "Choice not found" });
      }
      res.json({ message: "Choice deleted successfully" });
    } catch (err) {
      console.log("🚀 ~ err:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
