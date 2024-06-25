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
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("multer"));
const helper_1 = require("../utils/helper");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const count = yield story_1.default.countDocuments(Object.assign({}, keyword));
        const stories = yield story_1.default.find(Object.assign({}, keyword))
            .limit(pageSize)
            .skip(pageSize * (page - 1));
        res.json({ data: stories, page, pages: Math.ceil(count / pageSize) });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
    }
}));
router.post("/newStory", auth_1.verifyToken, upload.single("coverImage"), [
    (0, express_validator_1.check)("story", "Story is required").not().isEmpty(),
    (0, express_validator_1.check)("title", "Title is required").not().isEmpty(),
    (0, express_validator_1.check)("description", "Description is required").not().isEmpty(),
    (0, express_validator_1.check)("author", "Author is required").not().isEmpty(),
    (0, express_validator_1.check)("categories", "Categories are required").not().isEmpty(),
    (0, express_validator_1.check)("tags", "Tags are required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { story, title, description, author, categories, tags, chapters } = req.body;
        const coverImage = req.file;
        const imageUrls = yield (0, helper_1.uploadImages)([coverImage]);
        const coverImageUrl = imageUrls[0];
        const newStory = new story_1.default({
            story,
            title,
            description,
            author,
            categories,
            tags,
            chapters,
            coverImage: coverImageUrl || null,
        });
        const savedStory = yield newStory.save();
        res.json(savedStory);
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/deleteStory", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId } = req.query;
        if (!storyId) {
            return res.status(400).json({ message: "Story id is required" });
        }
        const deletedStory = yield story_1.default.findByIdAndDelete(storyId);
        if (!deletedStory) {
            return res.status(404).json({ message: "Story not found" });
        }
        res.json({ message: "Story deleted successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
