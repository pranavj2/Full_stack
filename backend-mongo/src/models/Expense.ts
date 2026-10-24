import { model, Schema, Types } from "mongoose";

export interface IExpense {
  title: string;
  amount: number;
  category: string;
  expenseDate: Date;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 150,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: 50,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Expense = model<IExpense>("Expense", expenseSchema);

export default Expense;
