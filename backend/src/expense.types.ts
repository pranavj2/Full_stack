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
