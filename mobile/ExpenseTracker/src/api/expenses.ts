import { apiClient } from './client';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  expense_date: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: string;
}

export interface UpdateExpenseInput {
  title?: string;
  amount?: number;
  category?: string;
}

export const expensesApi = {
  getAll: async (): Promise<Expense[]> => {
    const response = await apiClient.get<Expense[]>('/api/expenses');
    return response.data;
  },

  getById: async (id: number): Promise<Expense> => {
    const response = await apiClient.get<Expense>(`/api/expenses/${id}`);
    return response.data;
  },

  create: async (input: CreateExpenseInput): Promise<Expense> => {
    const response = await apiClient.post<Expense>('/api/expenses', input);
    return response.data;
  },

  update: async (id: number, input: UpdateExpenseInput): Promise<Expense> => {
    const response = await apiClient.patch<Expense>(
      `/api/expenses/${id}`,
      input,
    );
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/expenses/${id}`);
  },
};
