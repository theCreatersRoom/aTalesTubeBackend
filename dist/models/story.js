"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const storySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String, required: true },
    categories: { type: [String], required: true },
    tags: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    chapters: [
        {
            chapterId: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            order: { type: Number, required: true },
        },
    ],
});
const Story = mongoose_1.default.model("Story", storySchema);
exports.default = Story;
