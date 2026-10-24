import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';
import { PG_POOL } from '../database/database.constants.js';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
}

interface ExpenseRow {
  id: string | number;
  title: string;
  amount: string | number;
  category: string;
  expense_date: string;
}

@Injectable()
export class ExpensesService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  private mapRow(row: ExpenseRow): Expense {
    return {
      ...row,
      id: Number(row.id),
      amount: Number(row.amount),
      expense_date: String(row.expense_date).slice(0, 10),
    };
  }

  async findAll(): Promise<Expense[]> {
    const result = await this.pool.query<ExpenseRow>(
      `SELECT id, title, amount, category, expense_date
       FROM expenses
       ORDER BY id DESC`,
    );

    return result.rows.map((row) => this.mapRow(row));
  }

  async findOne(id: number): Promise<Expense> {
    const result = await this.pool.query<ExpenseRow>(
      `SELECT id, title, amount, category, expense_date
       FROM expenses
       WHERE id = $1`,
      [id],
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Expense not found');
    }

    return this.mapRow(result.rows[0]);
  }

  async create(dto: CreateExpenseDto): Promise<Expense> {
    const result = await this.pool.query<ExpenseRow>(
      `INSERT INTO expenses (title, amount, category)
       VALUES ($1, $2, $3)
       RETURNING id, title, amount, category, expense_date`,
      [dto.title.trim(), dto.amount, dto.category.trim()],
    );

    return this.mapRow(result.rows[0]);
  }

  async update(id: number, dto: UpdateExpenseDto): Promise<Expense> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (dto.title !== undefined) {
      values.push(dto.title.trim());
      fields.push(`title = $${values.length}`);
    }

    if (dto.amount !== undefined) {
      values.push(dto.amount);
      fields.push(`amount = $${values.length}`);
    }

    if (dto.category !== undefined) {
      values.push(dto.category.trim());
      fields.push(`category = $${values.length}`);
    }

    if (fields.length === 0) {
      return this.findOne(id);
    }

    values.push(id);

    const result = await this.pool.query<ExpenseRow>(
      `UPDATE expenses
       SET ${fields.join(', ')}
       WHERE id = $${values.length}
       RETURNING id, title, amount, category, expense_date`,
      values,
    );

    if (!result.rows[0]) {
      throw new NotFoundException('Expense not found');
    }

    return this.mapRow(result.rows[0]);
  }

  async remove(id: number): Promise<void> {
    const result = await this.pool.query('DELETE FROM expenses WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException('Expense not found');
    }
  }
}
