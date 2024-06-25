"use strict";
// {
//   "_id": "ObjectId",
//   "userId": "ObjectId",
//   "storyId": "ObjectId",
//   "currentChapterId": "ObjectId",
//   "choicesMade": [
//     {
//       "chapterId": "ObjectId",
//       "choiceId": "ObjectId",
//       "timestamp": "date"
//     }
//   ],
//   "startedAt": "date",
//   "updatedAt": "date"
// }
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userProgressSchema = new mongoose_1.default.Schema({
    userId: { type: String, ref: "User", required: true },
    storyId: { type: String, ref: "Story", required: true },
    currentChapterId: { type: String, ref: "Chapter", required: true },
    choicesMade: [
        {
            chapterId: { type: String, ref: "Chapter", required: true },
            choiceId: { type: String, ref: "Choice", required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    startedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const UserProgress = mongoose_1.default.model("UserProgress", userProgressSchema);
exports.default = UserProgress;
