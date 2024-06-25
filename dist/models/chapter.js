"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chapterSchema = new mongoose_1.default.Schema({
    storyId: { type: String, ref: "Story", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    media: [
        {
            type: String,
            url: String,
        },
    ],
    choices: [
        {
            choiceId: { type: String, ref: "Choice", required: true },
            text: { type: String, required: true },
            nextChapterId: { type: String, ref: "Chapter", required: true },
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const Chapter = mongoose_1.default.model("Chapter", chapterSchema);
exports.default = Chapter;
