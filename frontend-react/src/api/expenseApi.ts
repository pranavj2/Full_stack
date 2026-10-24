import axios from "axios";
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from "../types/expense";

import apiClient from "./apiClient";

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await apiClient.get<Expense[]>("/expenses");
  return response.data;
};

export const createExpense = async (
  expense: CreateExpenseInput,
): Promise<Expense> => {
  const response = await apiClient.post<Expense>("/expenses", expense);
  return response.data;
};

export const updateExpense = async (
  id: string,
  expense: UpdateExpenseInput,
): Promise<Expense> => {
  const response = await apiClient.patch<Expense>(`/expenses/${id}`, expense);
  return response.data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await apiClient.delete(`/expenses/${id}`);
};
