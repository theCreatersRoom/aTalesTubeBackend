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
const userProgress_1 = __importDefault(require("../models/userProgress"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId, userId } = req.query;
        const userProgress = yield userProgress_1.default.findOne({ storyId, userId });
        if (!userProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }
        res.json({ userProgress });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/newUserProgress", auth_1.verifyToken, [
    (0, express_validator_1.check)("storyId", "Story id is required").not().isEmpty(),
    (0, express_validator_1.check)("userId", "User id is required").not().isEmpty(),
    (0, express_validator_1.check)("currentChapterId", "Current chapter id is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { storyId, userId, currentChapterId, choicesMade } = req.body;
        const newUserProgress = new userProgress_1.default({
            storyId,
            userId,
            currentChapterId,
            choicesMade,
            startedAt: new Date(),
        });
        yield newUserProgress.save();
        res.json({ message: "User progress created successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.put("/updateUserProgress", auth_1.verifyToken, [
    (0, express_validator_1.check)("storyId", "Story id is required").not().isEmpty(),
    (0, express_validator_1.check)("userId", "User id is required").not().isEmpty(),
    (0, express_validator_1.check)("currentChapterId", "Current chapter id is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { storyId, userId, currentChapterId, choicesMade } = req.body;
        const userProgress = yield userProgress_1.default.findOneAndUpdate({ storyId, userId }, {
            currentChapterId,
            choicesMade,
            updatedAt: new Date(),
        }, { new: true });
        if (!userProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }
        else {
            res.json({ message: "User progress updated successfully" });
        }
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
    }
}));
router.delete("/deleteUserProgress", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { storyId, userId } = req.query;
        const deletedUserProgress = yield userProgress_1.default.findOneAndDelete({
            storyId,
            userId,
        });
        if (!deletedUserProgress) {
            return res.status(404).json({ message: "User progress not found" });
        }
        res.json({ message: "User progress deleted successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
