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
const choice_1 = __importDefault(require("../models/choice"));
const auth_1 = require("../middleware/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chapterId } = req.query;
        if (!chapterId) {
            return res.status(400).json({ message: "Chapter id is required" });
        }
        const choices = yield choice_1.default.find({ chapterId });
        res.json({ choices });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/createChoice", auth_1.verifyToken, [
    (0, express_validator_1.check)("chapterId", "Chapter id is required").not().isEmpty(),
    (0, express_validator_1.check)("text", "Text is required").not().isEmpty(),
    (0, express_validator_1.check)("nextChapterId", "Next chapter id is required").not().isEmpty(),
    (0, express_validator_1.check)("nextChapterId", "Next chapter id must be a string").isString(),
    (0, express_validator_1.check)("nextChapterId", "Next chapter id must be a chapter id").isMongoId(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { choice, chapterId, text, nextChapterId } = req.body;
        const newChoice = new choice_1.default({
            chapterId,
            text,
            nextChapterId,
        });
        yield newChoice.save();
        res.json({ message: "Choice created successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.delete("/deleteChoice", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { choiceId } = req.query;
        const deletedChoice = yield choice_1.default.findByIdAndDelete(choiceId);
        if (!deletedChoice) {
            return res.status(404).json({ message: "Choice not found" });
        }
        res.json({ message: "Choice deleted successfully" });
    }
    catch (err) {
        console.log("🚀 ~ err:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
