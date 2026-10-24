import { beforeEach, describe, it, expect, vi } from 'vitest';
import { Test } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller.js';
import { ExpensesService } from './expenses.service.js';

describe('ExpensesController', () => {
  let controller: ExpensesController;

  const mockExpensesService = {
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: mockExpensesService,
        },
      ],
    }).compile();

    controller = moduleRef.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all expenses from the service', async () => {
    mockExpensesService.findAll.mockResolvedValue([]);

    await expect(controller.findAll()).resolves.toEqual([]);
    expect(mockExpensesService.findAll).toHaveBeenCalledOnce();
  });
});
