import { pool } from "./db";
import {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from "./expense.types";

interface ExpenseRow {
  id: number;
  title: string;
  amount: string | number;
  category: string;
  expense_date: string;
}

function mapExpense(row: ExpenseRow): Expense {
  return {
    ...row,
    amount: Number(row.amount),
    expense_date: String(row.expense_date).slice(0, 10),
  };
}
// This says findAll() returns a Promise that resolves to an array of expenses
export async function findAll(): Promise<Expense[]> {
  const result = await pool.query<ExpenseRow>(
    `SELECT id, title, amount, category, expense_date
     FROM expenses
     ORDER BY id DESC`,
  );

  return result.rows.map(mapExpense);
}

export async function findById(id: number): Promise<Expense | null> {
  const result = await pool.query<ExpenseRow>(
    `SELECT id, title, amount, category, expense_date
     FROM expenses
     WHERE id = $1`,
    [id],
  );

  return result.rows[0] ? mapExpense(result.rows[0]) : null;
}

export async function create(input: CreateExpenseInput): Promise<Expense> {
  const result = await pool.query<ExpenseRow>(
    `INSERT INTO expenses (title, amount, category)
     VALUES ($1, $2, $3)
     RETURNING id, title, amount, category, expense_date`,
    [input.title, input.amount, input.category],
  );

  return mapExpense(result.rows[0]);
}

export async function update(
  id: number,
  input: UpdateExpenseInput,
): Promise<Expense | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.title !== undefined) {
    values.push(input.title);
    fields.push(`title = $${values.length}`);
  }

  if (input.amount !== undefined) {
    values.push(input.amount);
    fields.push(`amount = $${values.length}`);
  }

  if (input.category !== undefined) {
    values.push(input.category);
    fields.push(`category = $${values.length}`);
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);

  const result = await pool.query<ExpenseRow>(
    `UPDATE expenses
     SET ${fields.join(", ")}
     WHERE id = $${values.length}
     RETURNING id, title, amount, category, expense_date`,
    values,
  );

  return result.rows[0] ? mapExpense(result.rows[0]) : null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query(`DELETE FROM expenses WHERE id = $1`, [id]);

  return (result.rowCount ?? 0) > 0;
}
