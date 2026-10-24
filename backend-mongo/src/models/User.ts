import { model, Schema } from "mongoose";

export interface IUser {
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true },
);

const User = model<IUser>("User", userSchema);

export default User;
