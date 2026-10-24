import express, { Request, Response, NextFunction } from "express";
import * as expenseRepository from "./expense.repository";
import { CreateExpenseInput, UpdateExpenseInput } from "./expense.types";
import app from "./app";

const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

function validText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function validAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function parseId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running",
  });
});

// READ: Get all expenses
app.get("/api/expenses", async (_req, res, next) => {
  try {
    const expenses = await expenseRepository.findAll();

    res.json({ success: true, data: expenses });
  } catch (error) {
    next(error);
  }
});

// READ: Get one expense
app.get("/api/expenses/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    const expense = await expenseRepository.findById(id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({ success: true, data: expense });
  } catch (error) {
    return next(error);
  }
});

// CREATE: Add an expense
app.post("/api/expenses", async (req, res, next) => {
  try {
    if (!isRecord(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object",
      });
    }
    const { title, amount, category } = req.body ?? {};

    if (
      !validText(title, 150) ||
      !validAmount(amount) ||
      !validText(category, 50)
    ) {
      return res.status(400).json({
        success: false,
        message: "Provide a valid title, positive amount and category",
      });
    }

    const input: CreateExpenseInput = {
      title: title.trim(),
      amount,
      category: category.trim(),
    };

    const expense = await expenseRepository.create(input);

    return res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    return next(error);
  }
});

// UPDATE: Modify selected fields
app.patch("/api/expenses/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }
    if (!isRecord(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a JSON object",
      });
    }

    const { title, amount, category } = req.body ?? {};

    if (title === undefined && amount === undefined && category === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    if (
      (title !== undefined && !validText(title, 150)) ||
      (amount !== undefined && !validAmount(amount)) ||
      (category !== undefined && !validText(category, 50))
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields are invalid",
      });
    }

    const input: UpdateExpenseInput = {};

    if (title !== undefined) input.title = title.trim();
    if (amount !== undefined) input.amount = amount;
    if (category !== undefined) input.category = category.trim();

    const expense = await expenseRepository.update(id, input);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({ success: true, data: expense });
  } catch (error) {
    return next(error);
  }
});

// DELETE: Remove an expense
app.delete("/api/expenses/:id", async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    const deleted = await expenseRepository.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

// Centralized error handler
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON request body",
    });
  }
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
