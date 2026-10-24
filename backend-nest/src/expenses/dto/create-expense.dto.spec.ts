import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CreateExpenseDto } from './create-expense.dto.js';

describe('CreateExpenseDto', () => {
  it('accepts a valid expense', async () => {
    const dto = Object.assign(new CreateExpenseDto(), {
      title: 'Lunch',
      amount: 250,
      category: 'Food',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('rejects a negative amount', async () => {
    const dto = Object.assign(new CreateExpenseDto(), {
      title: 'Lunch',
      amount: -10,
      category: 'Food',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'amount')).toBe(true);
  });

  it('rejects a missing title', async () => {
    const dto = Object.assign(new CreateExpenseDto(), {
      amount: 250,
      category: 'Food',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'title')).toBe(true);
  });

  it('rejects an amount supplied as a string', async () => {
    const dto = Object.assign(new CreateExpenseDto(), {
      title: 'Lunch',
      amount: '250',
      category: 'Food',
    });

    const errors = await validate(dto);

    expect(errors.some((error) => error.property === 'amount')).toBe(true);
  });
});
