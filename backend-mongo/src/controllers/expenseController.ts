import type { Request, Response } from "express";
import Expense from "../models/Expense";

const isValidId = (id: string): boolean => /^[a-f\d]{24}$/i.test(id);

const isMongooseValidationError = (
  error: unknown,
): error is Error & { name: string } =>
  error instanceof Error &&
  (error.name === "ValidationError" || error.name === "CastError");

// GET /api/expenses
export async function getExpenses(_req: Request, res: Response): Promise<void> {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.status(200).json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
}

// GET /api/expenses/:id
export async function getExpenseById(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ message: "Invalid expense ID" });
      return;
    }

    const expense = await Expense.findById(id);

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json(expense);
  } catch {
    res.status(500).json({ message: "Failed to fetch expense" });
  }
}

// POST /api/expenses
export async function createExpense(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { title, amount, category, expenseDate } = req.body;

    if (!req.userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      userId: req.userId,
      ...(expenseDate !== undefined ? { expenseDate } : {}),
    });

    res.status(201).json(expense);
  } catch (error: unknown) {
    if (isMongooseValidationError(error)) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Failed to create expense" });
  }
}

// PATCH /api/expenses/:id
export async function updateExpense(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ message: "Invalid expense ID" });
      return;
    }

    const allowedFields = ["title", "amount", "category", "expenseDate"];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ message: "No valid fields to update" });
      return;
    }

    const expense = await Expense.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json(expense);
  } catch (error: unknown) {
    if (isMongooseValidationError(error)) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Failed to update expense" });
  }
}

// DELETE /api/expenses/:id
export async function deleteExpense(
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res.status(400).json({ message: "Invalid expense ID" });
      return;
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch {
    res.status(500).json({ message: "Failed to delete expense" });
  }
}
