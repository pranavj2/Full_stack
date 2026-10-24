import { describe, it, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { ExpensesService } from './expenses.service.js';
import { PG_POOL } from '../database/database.module.js';

describe('ExpensesService', () => {
  it('returns expenses from the database', async () => {
    const mockExpenses = [
      {
        id: 1,
        title: 'Lunch',
        amount: '250.00',
        category: 'Food',
        expense_date: '2026-10-22',
      },
    ];

    const mockPool = {
      query: vi.fn().mockResolvedValue({
        rows: mockExpenses,
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: PG_POOL,
          useValue: mockPool,
        },
      ],
    }).compile();

    const service = moduleRef.get(ExpensesService);
    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Lunch');
    expect(result[0].amount).toBe(250);
    expect(mockPool.query).toHaveBeenCalledOnce();

    await moduleRef.close();
  });
});
