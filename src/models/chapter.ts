import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
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

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;
