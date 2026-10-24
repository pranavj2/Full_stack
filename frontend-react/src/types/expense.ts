export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateExpenseInput {
  title: string;
  amount: number;
  category: string;
  expenseDate?: string;
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>;

export interface ExpenseFormState {
  title: string;
  amount: string;
  category: string;
}
