"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const choiceSchema = new mongoose_1.default.Schema({
    chapterId: { type: String, ref: "Chapter", required: true },
    text: { type: String, required: true },
    nextChapterId: { type: String, ref: "Chapter", required: true },
});
const Choice = mongoose_1.default.model("Choice", choiceSchema);
exports.default = Choice;
