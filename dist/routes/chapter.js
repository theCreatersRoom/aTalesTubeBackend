"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const story_1 = __importDefault(require("../models/story"));
const chapter_1 = __importDefault(require("../models/chapter"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chpaterId } = req.query;
        if (!chpaterId) {
            return res.status(400).json({ message: "Chapter id is required" });
        }
        const chapter = yield chapter_1.default.findById(chpaterId);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        res.json(chapter);
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// This will create new chapter to specific story and push chapter in story array
router.post("/newChapter", auth_1.verifyToken, [
    (0, express_validator_1.check)("storyId", "Story id is required").not().isEmpty(),
    (0, express_validator_1.check)("title", "Title is required").not().isEmpty(),
    (0, express_validator_1.check)("content", "Content is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { storyId, title, content } = req.body;
        const story = yield story_1.default.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        const newChapter = new chapter_1.default({
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
        const savedChapter = yield newChapter.save();
        res.json(savedChapter);
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// this will delete chapter from story
router.delete("/deleteChapter", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { chapterId } = req.query;
        const chapter = yield chapter_1.default.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        const story = yield story_1.default.findById(chapter.storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }
        const deletedChapter = yield chapter_1.default.findByIdAndDelete(chapterId);
        if (!deletedChapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        story.chapters = story.chapters.filter((chapter) => chapter.chapterId !== chapterId);
        yield story.save();
        res.json({ message: "Chapter deleted successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
