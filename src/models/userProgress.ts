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

import mongoose from "mongoose";

type UserProgressType = {
  _id: string;
  userId: string;
  storyId: string;
  currentChapterId: string;
  choicesMade: {
    chapterId: string;
    choiceId: string;
    timestamp: Date;
  }[];
  startedAt: Date;
  updatedAt: Date;
};

const userProgressSchema = new mongoose.Schema<UserProgressType>({
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

const UserProgress = mongoose.model<UserProgressType>(
  "UserProgress",
  userProgressSchema
);

export default UserProgress;
