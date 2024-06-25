import mongoose from "mongoose";

type ChoiceType = {
  _id: string;
  chapterId: string;
  text: string;
  nextChapterId: string;
};

const choiceSchema = new mongoose.Schema<ChoiceType>({
  chapterId: { type: String, ref: "Chapter", required: true },
  text: { type: String, required: true },
  nextChapterId: { type: String, ref: "Chapter", required: true },
});

const Choice = mongoose.model<ChoiceType>("Choice", choiceSchema);

export default Choice;
