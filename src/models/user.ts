import mongoose from "mongoose";

export type UserType = {
  _id: string;
  username: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema<UserType>({
  username: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  passwordHash: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
