import mongoose from "mongoose";

type StoryType = {
  _id: string;
  title: string;
  description: string;
  author: string;
  coverImage: string;
  categories: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  chapters: {
    chapterId: string;
    title: string;
    description: string;
    order: number;
  }[];
};

const storySchema = new mongoose.Schema<StoryType>({
  description: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  coverImage: { type: String, required: false },
  categories: { type: [String], required: false },
  tags: { type: [String], required: false },
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

const Story = mongoose.model<StoryType>("Story", storySchema);

export default Story;
